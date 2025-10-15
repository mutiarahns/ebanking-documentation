# EBank

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
  - [Clean Architecture](#clean-architecture)
  - [MVVM + Coordinator](#mvvm--coordinator)
  - [Dependency Injection](#dependency-injection)
- [Project Structure](#project-structure)
- [Build Configuration](#build-configuration)
- [Layer Overview](#layer-overview)
- [Testing](#testing)
  - [Testing Approach](#testing-approach)
- [Key Components](#key-components)
  - [Base Classes](#base-classes)
  - [Navigation](#navigation)
  - [Dependency Injection](#dependency-injection-1)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Design System](#design-system)
- [Features](#features)
- [Development Guides](#development-guides)
  - [Adding a New Screen with MVVM+C](#adding-a-new-screen-with-mvvmc)
  - [Adding a New API Endpoint](#adding-a-new-api-endpoint)
  - [Creating a Use Case for a New Feature](#creating-a-use-case-for-a-new-feature)
  - [Implementing Dependency Injection](#implementing-dependency-injection)
  - [Building for Different Environments](#building-for-different-environments)

## Project Overview

EBank is a mobile application for iOS devices built using Swift and SwiftUI. The application follows a clean architecture approach with MVVM (Model-View-ViewModel) design pattern and Coordinator pattern for navigation.

## Architecture

### Clean Architecture

The project is structured following Clean Architecture principles, separating the codebase into distinct layers:

1. **Presentation Layer**: Contains UI components, ViewModels, and Coordinators
2. **Domain Layer**: Contains business logic, use cases, and domain models
3. **Data Layer**: Contains repositories, data sources, and DTOs (Data Transfer Objects)
4. **Core Layer**: Contains common utilities, extensions, and base components
5. **Networking Layer**: Contains API clients, endpoints, and network models

### MVVM + Coordinator

The application uses MVVM (Model-View-ViewModel) architecture with Coordinators for navigation:

- **Model**: Represents the data and business logic
- **View**: Represents the UI components (SwiftUI views)
- **ViewModel**: Contains the presentation logic and state management
- **Coordinator**: Handles navigation between screens

### Dependency Injection

The application uses a custom dependency injection system to manage dependencies between components. This system follows a service locator pattern combined with a module-based approach to organize and provide dependencies.

#### Core Components

- **DependencyInjector**: A service locator that registers and resolves dependencies

  - Implemented as a singleton that maintains a registry of factory closures
  - Provides methods to register, resolve, and override dependencies
  - Uses type names as keys for the dependency registry

- **ModuleFactory**: Creates and configures feature modules

  - A protocol that defines how to create a module with its dependencies
  - Each feature module has its own factory implementation
  - Responsible for wiring up all dependencies within a module

- **ModuleDependency**: Defines the dependencies required by a module
  - A marker protocol that all module dependency protocols extend
  - Each feature module defines its own dependency protocol
  - Specifies what dependencies the module provides to other components

#### How It Works

1. At application startup, `AppBootstrap.configure()` registers all feature modules with the `DependencyInjector`
2. Each module is created by its respective factory, which wires up all dependencies
3. When a component needs a dependency, it resolves it from the `DependencyInjector`
4. This approach allows for loose coupling between components and easier testing

## Project Structure

```
EBank/
├── EBank/              # Main application code
│
├── Application/                  # Application entry point and configuration
│   ├── Configuration/            # Build configurations
│   ├── AppDelegate.swift         # UIApplicationDelegate implementation
│   ├── EBankApp.swift            # SwiftUI App implementation
│   └── ContentView.swift         # Main content view
│
├── Core/                         # Core components and utilities
│   ├── Common/                   # Shared helpers and constants
│   │   ├── Extensions/           # Reusable Swift extensions
│   │   └── Utilities/            # Global utilities & helper functions
│   ├── DI/                       # Dependency injection system
│   │   ├── Bootstrap.swift       # Application bootstrap configuration
│   │   ├── DependencyInjector.swift # Dependency injection container
│   │   ├── ModuleFactory.swift   # Factory for creating modules
│   │   └── ModuleDependency.swift # Module dependency protocol
│   │
│   ├── DesignSystem/               # Design system and UI foundation
│   │   ├── Assets/                 # Colors, images, icons
│   │   ├── Components/             # Reusable UI components (buttons, inputs, etc.)
│   │   ├── Fonts/                  # Custom font management
│   │   └── Styles/                 # Global style tokens (spacing, radii, shadows)
│   │
│   ├── MVVMBase/                 # Base classes for MVVM architecture
│   │   ├── PageContent.swift     # Protocol for page content
│   │   ├── PageRouter.swift      # Protocol for page routing
│   │   ├── PageView.swift        # Base view class
│   │   └── PageViewModel.swift   # Base view model class
│   │
│   └── Manager/                  # Manager classes
│       └── BottomsheetManager.swift    # Bottomsheet management
│       ├── LoadingManager.swift        # Loading management
│       └── NavigationManager.swift     # Navigation management
│
├── DataLayer/                    # Data layer components
│   ├── DTO/                      # Data Transfer Objects
│   ├── Datasource/               # Data sources (Remote, Local)
│   └── Repository/               # Repository implementations
│
├── DomainLayer/                  # Domain layer components
│   ├── Model/                    # Domain models
│   ├── RepositoryProtocol/       # Repository interfaces
│   └── Usecase/                  # Use case implementations
│
├── Networking/                   # Networking components
│   ├── APIEndpoint/              # API endpoint definitions
│   ├── Provider/                 # Network providers
│   ├── BaseService.swift         # Base networking service
│   ├── DigitalSignatureValidator.swift # Validates digital signatures
│   ├── NetworkError.swift        # Network error definitions
│   ├── StatusCode.swift          # HTTP status code definitions
│   └── TargetType.swift          # Target type protocol
│
├── Preview Content/             # SwiftUI preview assets and resources
│   └── Preview Assets.xcassets   # Preview assets catalog
│
└── Feature/                     # Feature modules (Presentation layer)
    ├── Dashboard/                # Dashboard feature
    │   ├── DashboardMain/        # Dashboard main screen
    │   │   ├── Coordinator/      # Screen coordinator
    │   │   └── Presentation/     # Screen presentation
    │   └── Home/                 # Home screen
    │       ├── Coordinator/      # Screen coordinator
    │       └── Presentation/     # Screen presentation
    │
    └── Onboarding/               # Onboarding feature
        ├── Login/                # Login screen
        │   ├── Coordinator/      # Screen coordinator
        │   └── Presentation/     # Screen presentation
        └── Splashscreen/         # Splash screen
            ├── Coordinator/      # Screen coordinator
            └── Presentation/     # Screen presentation
```

## Build Configuration

The EBank project supports multiple build configurations for different environments. Each configuration has its own settings, API endpoints, and app identifiers.

### Available Build Configurations

#### 1. Development (Dev)

- **Configuration File**: `DevConfig.xcconfig`
- **Scheme**: `EBankDevelopment`
- **Build Configurations**: `DevDebug`, `DevRelease`

#### 2. UAT (User Acceptance Testing)

- **Configuration File**: `UatConfig.xcconfig`
- **Scheme**: `EBankUat`
- **Build Configurations**: `UatDebug`, `UatRelease`

#### 3. Production (Prod)

- **Configuration File**: `ProdConfig.xcconfig`
- **Scheme**: `EBank`
- **Build Configurations**: `ProductionDebug`, `ProductionRelease`

### Configuration Files Structure

Each environment has its own `.xcconfig` file located in `EBank/Application/Configuration/`:

```
Configuration/
├── DevConfig.xcconfig          # Development environment settings
├── ProdConfig.xcconfig         # Production environment settings
└── UatConfig.xcconfig          # UAT environment settings
```

### Configuration Variables

Each `.xcconfig` file contains the following variables:

```
| Variable         | Description                      | Example                           |
| ---------------- | -------------------------------- | --------------------------------- |
| `BASE_URL`       | API base URL for the environment | `https://dummyjson.com`           |
| `APP_NAME`       | Display name of the application  | `[DEV] EBank`                     |
| `APP_ICON`       | App icon asset name              | `AppIconDev`                      |
| `APP_IDENTIFIER` | Bundle identifier                | `co.id.example.project.EBank.dev` |
| `VERSION_NUMBER` | App version number               | `1.0.0`                           |
| `BUILD_NUMBER`   | Build number                     | `1`                               |
```

### Adding New Configuration Variables

To add new configuration variables:

1. Add the variable to all `.xcconfig` files:

   ```xcconfig
   // In DevConfig.xcconfig
   NEW_VARIABLE = dev_value

   // In UatConfig.xcconfig
   NEW_VARIABLE = uat_value

   // In ProdConfig.xcconfig
   NEW_VARIABLE = prod_value
   ```

2. Use the variable in your code:
   ```swift
   let newValue = Bundle.main.object(forInfoDictionaryKey: "NEW_VARIABLE") as? String
   ```

### Best Practices

1. **Environment Separation**: Keep development, UAT, and production configurations completely separate
2. **Security**: Never commit sensitive information like API keys directly in configuration files
3. **Version Management**: Update version numbers consistently across all environments
4. **Testing**: Always test builds in UAT environment before production deployment
5. **Documentation**: Keep configuration documentation up to date when adding new variables

## Layer Overview

### 🏁 Application

Handles app lifecycle, configuration, and the SwiftUI entry point.

- `AppDelegate.swift` – push notifications, app lifecycle.
- `EBankApp.swift` – main SwiftUI `App` structure.

---

### ⚙️ Core

Contains framework-independent components used across all layers.

- **Common/** – reusable utilities and extensions.
- **DesignSystem/** – central UI foundation (fonts, styles, components).
- **DI/** – dependency injection and module creation.
- **MVVMBase/** – base view/viewmodel/router abstractions.
- **Managers/** – global managers (navigation, popup, analytics, etc.).

---

### 🌐 Networking

Defines everything related to API communication.

- Endpoints, requests, and error management.
- Provides `BaseService` for API calls, extending easily to repositories.
- Includes response validation (`DigitalSignatureValidator.swift`).

---

### 💾 DataLayer

Responsible for accessing, transforming, and caching raw data.

- **DTO/** – raw structures for network responses.
- **Datasource/** – local (e.g., CoreData) and remote (API) sources.
- **Repository/** – maps data sources to domain models.

---

### 🧠 DomainLayer

The heart of your business logic — pure Swift, no UI dependencies.

- **Models/** – domain entities.
- **RepositoryProtocols/** – contracts for repositories.
- **UseCases/** – core application logic built on repositories.

---

### 🖥 Feature

Presentation layer organized by feature module.

Each feature contains:

- `Coordinator/` – defines navigation flow.
- `Presentation/` – SwiftUI views, ViewModels, and state management.

Example:

## Testing

The project includes both unit tests and UI tests:

```
EBankTests/              # Unit tests directory
└── EBankTests.swift     # Unit test cases

EBankUITests/            # UI tests directory
├── EBankUITests.swift   # UI test cases
└── EBankUITestsLaunchTests.swift  # Launch test cases
```

### Testing Approach

The project follows these testing principles:

- **Unit Tests**: Test individual components in isolation (ViewModels, UseCases, Repositories)
- **UI Tests**: Test the user interface and interactions
- **Dependency Injection**: Makes components testable by allowing mock implementations
- **Test Doubles**: Uses mocks and stubs to isolate components during testing

To run tests:

1. Open the project in Xcode
2. Select the test target (EBankTests or EBankUITests)
3. Press Cmd+U or navigate to Product > Test

## Key Components

### Base Classes

- **PageView**: Base view class for all screens
- **PageViewModel**: Base view model class for all screens
- **PageContent**: Protocol for page content
- **PageRouter**: Protocol for page routing

### Navigation

- **NavigationManager**: Singleton class for managing navigation
- **NavigationControllerView**: SwiftUI wrapper for UINavigationController
- **Coordinator**: Handles navigation between screens

### Dependency Injection

- **DependencyInjector**: Service locator for dependency injection
- **AppBootstrap**: Configures the application's dependencies
- **ModuleFactory**: Creates and configures feature modules

## Getting Started

### Requirements

- iOS 14.0+
- Xcode 12.0+
- Swift 5.3+

### Installation

1. Clone the repository
2. Open `EBank.xcodeproj` in Xcode
3. Build and run the project

## Design System

The application uses a custom design system with:

- Custom fonts (Sora)
- Color palette
- Reusable UI components

## Features

- Authentication
- Dashboard
- Home
- Settings

## Development Guides

### Adding a New Screen with MVVM+C

To add a new screen to the application using the MVVM+C pattern, follow these steps:

#### 1. Create the Feature Directory Structure

Create a new directory for your feature in the appropriate location:

```
Feature/
└── YourFeature/
    └── YourScreen/
        ├── Coordinator/
        │   └── YourScreenCoordinator.swift
        └── Presentation/
            ├── YourScreenView.swift
            ├── YourScreenViewModel.swift
            └── YourScreenModel.swift (optional)
```

#### 2. Create the View

Create a new SwiftUI view that conforms to the `PageContent` protocol:

```swift
import SwiftUI

public struct YourScreenView: PageContent {
    @ObservedObject public var viewModel: YourScreenViewModel

    public var body: some View {
        renderBody()
    }
}

extension YourScreenView {
    func renderBody() -> some View {
        VStack {
            Text("Your Screen Content")
            Button("Perform Action") {
                viewModel.performAction()
            }
        }
    }

    // Add more rendering methods as needed
}
```

#### 3. Create the ViewModel

Create a view model that extends `PageViewModel`:

```swift
import SwiftUI
import Combine

public final class YourScreenViewModel: PageViewModel {
    // Published properties for UI state
    @Published var someState: String = ""

    // Dependencies
    let usecase: YourUsecaseProtocol

    // Navigation callbacks
    var onNavigateToNextScreen: TypeAliases.VoidHandler?

    // Initialization with dependencies
    init(dependencies: Dependencies) {
        self.usecase = dependencies.usecase
    }

    // Lifecycle methods
    func onLoad() {
        // Called when the view appears
        fetchData()
    }

    // Business logic methods
    func performAction() {
        usecase.execute()
            .sink(receiveCompletion: { completion in
                // Handle completion
            }, receiveValue: { [weak self] result in
                // Handle result
                self?.onNavigateToNextScreen?()
            })
            .store(in: &cancellables)
    }

    private func fetchData() {
        // Fetch initial data
    }
}

// Dependencies container
extension YourScreenViewModel {
    struct Dependencies {
        let usecase: YourUsecaseProtocol

        public init(usecase: YourUsecaseProtocol) {
            self.usecase = usecase
        }
    }
}
```

#### 4. Create the Coordinator

Create a coordinator that conforms to `PageRouter`:

```swift
import SwiftUI

public protocol YourScreenCoordinatorProtocol {
    func onNavigateToNextScreen()
}

public struct YourScreenCoordinator: PageRouter {
    @StateObject var viewModel: YourScreenViewModel
    let usecase: YourUsecaseProtocol

    public init(
        usecase: YourUsecaseProtocol = DependencyInjector.shared
            .resolve(YourModuleDependencies.self)
            .yourUsecase
    ) {
        self.usecase = usecase
        _viewModel = StateObject(
            wrappedValue: YourScreenViewModel(dependencies: .init(usecase: usecase))
        )
    }

    public var body: some View {
        PageView(
            navigationBarHidden: false,
            navigationBarTitle: "Your Screen"
        ) {
            YourScreenView(viewModel: viewModel)
        }
        .onAppear {
            setupViewModel()
        }
        .onDisappear {
            unsetViewModel()
        }
    }

    public func setupViewModel() {
        viewModel.onNavigateToNextScreen = onNavigateToNextScreen
    }

    public func unsetViewModel() {
        viewModel.onNavigateToNextScreen = nil
    }
}

extension YourScreenCoordinator: YourScreenCoordinatorProtocol {
    public func onNavigateToNextScreen() {
        navigationManager.pushRouter(router: NextScreenCoordinator())
    }
}
```

#### 5. Register the Screen in the Navigation Flow

To make your screen accessible from other parts of the application, you need to add navigation to it from an existing screen:

```swift
// In an existing coordinator
public func navigateToYourScreen() {
    navigationManager.pushRouter(router: YourScreenCoordinator())
}
```

### Adding a New API Endpoint

To add a new API endpoint to the application, follow these steps:

#### 1. Create or Update the API Endpoint Enum

Create a new enum or update an existing one in the `Core/Networking/APIEndpoint` directory:

```swift
import Foundation
import Alamofire

public enum YourFeatureAPI: TargetType {
    case fetchData(id: String)
    case submitData(data: YourRequestModel)
}

extension YourFeatureAPI {
    public var path: String {
        switch self {
        case .fetchData: "your-feature/data"
        case .submitData: "your-feature/submit"
        }
    }

    public var method: Alamofire.HTTPMethod {
        switch self {
        case .fetchData: .get
        case .submitData: .post
        }
    }

    public var task: Task {
        switch self {
        case .fetchData(let id):
            return .requestParameters(
                parameters: ["id": id],
                encoding: URLEncoding.default
            )
        case .submitData(let data):
            return .requestJSONEncodable(data)
        }
    }

    // Optional: Override baseURL if needed
    public var baseURL: URL {
        guard let url = URL(string: "https://your-api-base-url.com/") else { fatalError() }
        return url
    }

    // Optional: Add custom headers if needed
    public var additionalHeaders: [String: Any]? {
        return ["Custom-Header": "Value"]
    }
}
```

#### 2. Create Request and Response DTOs

Create data transfer objects for your API requests and responses in the `DataLayer/DTO` directory:

```swift
// YourRequestModel.swift
public struct YourRequestModel: Encodable {
    let id: String
    let name: String

    public init(id: String, name: String) {
        self.id = id
        self.name = name
    }
}

// YourResponseModel.swift
public struct YourResponseModel: Decodable {
    let id: String
    let name: String
    let createdAt: String
}
```

#### 3. Create a Data Source

Create a data source in the `DataLayer/Datasource/Remote` directory:

```swift
import Foundation
import Combine

public protocol YourFeatureDataSourceProtocol {
    func fetchData(id: String) -> BaseApiResponseData<YourResponseModel>
    func submitData(data: YourRequestModel) -> BaseApiResponseData<YourResponseModel>
}

public final class YourFeatureDataSource: BaseService, YourFeatureDataSourceProtocol {
    public func fetchData(id: String) -> BaseApiResponseData<YourResponseModel> {
        requestGeneralV2(YourFeatureAPI.fetchData(id: id))
    }

    public func submitData(data: YourRequestModel) -> BaseApiResponseData<YourResponseModel> {
        requestGeneralV2(YourFeatureAPI.submitData(data: data))
    }
}
```

#### 4. Use the API Endpoint in a Repository

Create or update a repository in the `DataLayer/Repository` directory:

```swift
public final class YourFeatureRepository: YourFeatureRepositoryProtocol {
    private let dataSource: YourFeatureDataSourceProtocol

    public init(dataSource: YourFeatureDataSourceProtocol) {
        self.dataSource = dataSource
    }

    public func fetchData(id: String) -> GeneralResponseData<YourDomainModel> {
        return dataSource.fetchData(id: id)
            .mapToGeneralResponse { dto in
                YourResponseMapper().map(dto.result)
            }
            .eraseToAnyPublisher()
    }

    public func submitData(data: YourDomainModel) -> GeneralResponseData<YourDomainModel> {
        let requestDTO = YourRequestMapper().map(data)
        return dataSource.submitData(data: requestDTO)
            .mapToGeneralResponse { dto in
                YourResponseMapper().map(dto.result)
            }
            .eraseToAnyPublisher()
    }
}
```

### Creating a Use Case for a New Feature

Use cases represent the business logic of your application. They act as an intermediary between the presentation layer (ViewModels) and the data layer (Repositories).

#### 1. Define the Domain Model

Create a domain model in the `DomainLayer/Model` directory:

```swift
public struct YourDomainModel {
    public let id: String
    public let name: String
    public let createdAt: Date

    public init(id: String, name: String, createdAt: Date) {
        self.id = id
        self.name = name
        self.createdAt = createdAt
    }
}
```

#### 2. Create a Repository Protocol

Define a repository protocol in the `DomainLayer/RepositoryProtocol` directory:

```swift
import Combine

public protocol YourFeatureRepositoryProtocol {
    func fetchData(id: String) -> GeneralResponseData<YourDomainModel>
    func submitData(data: YourDomainModel) -> GeneralResponseData<YourDomainModel>
}
```

#### 3. Create a Use Case Protocol and Implementation

Create a use case in the `DomainLayer/Usecase` directory:

```swift
import Combine

public protocol YourFeatureUsecaseProtocol {
    func fetchData(id: String) -> GeneralResponseData<YourDomainModel>
    func submitData(id: String, name: String) -> GeneralResponseData<YourDomainModel>
}

public final class YourFeatureUsecase: YourFeatureUsecaseProtocol {
    private let repository: YourFeatureRepositoryProtocol

    public init(repository: YourFeatureRepositoryProtocol) {
        self.repository = repository
    }

    public func fetchData(id: String) -> GeneralResponseData<YourDomainModel> {
        return repository.fetchData(id: id)
    }

    public func submitData(id: String, name: String) -> GeneralResponseData<YourDomainModel> {
        let model = YourDomainModel(id: id, name: name, createdAt: Date())
        return repository.submitData(data: model)
    }
}
```

#### 4. Register the Use Case in the Module Factory

Create or update a module factory in the `Core/DI/Module` directory:

```swift
public protocol YourFeatureModuleDependencies: ModuleDependency {
    var yourFeatureUsecase: YourFeatureUsecaseProtocol { get }
}

public final class YourFeatureModule: YourFeatureModuleDependencies {
    public var yourFeatureUsecase: YourFeatureUsecaseProtocol

    public init() {
        let dataSource = YourFeatureDataSource()
        let repository = YourFeatureRepository(dataSource: dataSource)
        self.yourFeatureUsecase = YourFeatureUsecase(repository: repository)
    }
}

public struct YourFeatureModuleFactory: ModuleFactory {
    public func makeModule() -> some YourFeatureModuleDependencies {
        YourFeatureModule()
    }
}
```

#### 5. Register the Module in AppBootstrap

Update the `AppBootstrap.configure()` method in `Core/DI/Bootstrap.swift`:

```swift
public static func configure() {
    let injector = DependencyInjector.shared

    // Register existing modules
    injector.register(AuthModuleDependencies.self) {
        AuthModuleFactory().makeModule()
    }

    // Register your new module
    injector.register(YourFeatureModuleDependencies.self) {
        YourFeatureModuleFactory().makeModule()
    }
}
```

#### 6. Use the Use Case in a ViewModel

Inject and use the use case in your ViewModel:

```swift
public final class YourScreenViewModel: PageViewModel {
    let usecase: YourFeatureUsecaseProtocol

    init(dependencies: Dependencies) {
        self.usecase = dependencies.usecase
    }

    func fetchData(id: String) {
        usecase.fetchData(id: id)
            .sink(receiveCompletion: { completion in
                // Handle completion
            }, receiveValue: { [weak self] result in
                // Handle result
            })
            .store(in: &cancellables)
    }
}

extension YourScreenViewModel {
    struct Dependencies {
        let usecase: YourFeatureUsecaseProtocol

        public init(usecase: YourFeatureUsecaseProtocol) {
            self.usecase = usecase
        }
    }
}
```

### Implementing Dependency Injection

To implement dependency injection for a new feature module:

1. **Define the module dependencies protocol**:

   ```swift
   public protocol YourModuleDependencies: ModuleDependency {
       var someUsecase: SomeUsecaseProtocol { get }
       var someManager: SomeManagerProtocol { get }
   }
   ```

2. **Create the module implementation**:

   ```swift
   public final class YourModule: YourModuleDependencies {
       public var someUsecase: SomeUsecaseProtocol
       public var someManager: SomeManagerProtocol

       public init() {
           let dataSource = SomeDataSource()
           let repository = SomeRepository(dataSource: dataSource)
           self.someUsecase = SomeUsecase(repository: repository)
           self.someManager = SomeManager()
       }
   }
   ```

3. **Create the module factory**:

   ```swift
   public struct YourModuleFactory: ModuleFactory {
       public func makeModule() -> some YourModuleDependencies {
           YourModule()
       }
   }
   ```

4. **Register the module in AppBootstrap**:

   ```swift
   // In AppBootstrap.configure()
   injector.register(YourModuleDependencies.self) {
       YourModuleFactory().makeModule()
   }
   ```

5. **Resolve dependencies when needed**:
   ```swift
   // In a component that needs the dependencies
   let dependencies = DependencyInjector.shared.resolve(YourModuleDependencies.self)
   let usecase = dependencies.someUsecase
   ```

This approach promotes:

- **Modularity**: Each feature has its own module with clear dependencies
- **Testability**: Dependencies can be easily mocked for testing
- **Maintainability**: Dependencies are explicitly defined and centrally managed

### Building for Different Environments

#### Using Xcode Schemes

1. **Development Build**:

   - Select `EBankDevelopment` scheme
   - Choose `DevDebug` for debugging or `DevRelease` for release
   - Build and run

2. **UAT Build**:

   - Select `EBankUat` scheme
   - Choose `UatDebug` for debugging or `UatRelease` for release
   - Build and run

3. **Production Build**:
   - Select `EBank` scheme
   - Choose `ProductionDebug` for debugging or `ProductionRelease` for release
   - Build and run
