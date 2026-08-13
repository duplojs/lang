import { DInvocation, type ExpectType } from "@scripts";

describe("createUseCase", () => {
	it("should create a use case handler with injected ports", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const dependencies = {
			UserRepository,
		};
		const getUserNameHandler = DInvocation.createUseCase(
			dependencies,
			({ userRepository }) => {
				type _CheckUserRepository = ExpectType<
					typeof userRepository,
					UserRepository,
					"strict"
				>;

				return (id: string) => userRepository.findName(id);
			},
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const getUserName = getUserNameHandler.getUseCase({ userRepository });

		expect(DInvocation.useCaseHandlerKind.has(getUserNameHandler)).toBe(true);
		expect(getUserNameHandler.dependencies).toBe(dependencies);
		expect(getUserName("42")).toBe("user-42");

		type _CheckHandler = ExpectType<
			typeof getUserNameHandler,
			DInvocation.UseCaseHandler<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});

	it("should inject nested use cases and allow explicit use case injection", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const getUserNameHandler = DInvocation.createUseCase(
			{ UserRepository },
			({ userRepository }) => (id: string) => userRepository.findName(id),
		);
		const dependencies = {
			GetUserName: getUserNameHandler,
		};
		const welcomeUserHandler = DInvocation.createUseCase(
			dependencies,
			({ getUserName }) => (id: string) => `Welcome ${getUserName(id)}`,
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const welcomeUser = welcomeUserHandler.getUseCase({ userRepository });
		const injectedGetUserName = (id: string) => `injected-${id}`;
		const welcomeInjectedUser = welcomeUserHandler.getUseCase({
			getUserName: injectedGetUserName,
			userRepository,
		});

		expect(welcomeUser("42")).toBe("Welcome user-42");
		expect(welcomeInjectedUser("42")).toBe("Welcome injected-42");

		type _CheckWelcomeUserHandler = ExpectType<
			typeof welcomeUserHandler,
			DInvocation.UseCaseHandler<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});
});

describe("wireUseCases", () => {
	it("should instantiate use cases with shared ports", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const getUserNameHandler = DInvocation.createUseCase(
			{ UserRepository },
			({ userRepository }) => (id: string) => userRepository.findName(id),
		);
		const welcomeUserHandler = DInvocation.createUseCase(
			{ GetUserName: getUserNameHandler },
			({ getUserName }) => (id: string) => `Welcome ${getUserName(id)}`,
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const useCases = DInvocation.wireUseCases(
			{
				GetUserName: getUserNameHandler,
				WelcomeUser: welcomeUserHandler,
			},
			{ userRepository },
		);

		expect(useCases.getUserName("42")).toBe("user-42");
		expect(useCases.welcomeUser("42")).toBe("Welcome user-42");

		type _CheckUseCases = ExpectType<
			typeof useCases,
			{
				getUserName(id: string): string;
				welcomeUser(id: string): string;
			},
			"strict"
		>;
	});
});
