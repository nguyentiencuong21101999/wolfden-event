# Wolfden

### How to run:

-   yarn install
-   copy .env.example to .env
-   yarn start:dev (development)
-   yarn start (production)

### Module structure:

-   \*.dto.ts: DTO (Data object transfer) defines how the data will be sent over the network.
-   \*.model.ts: Define object map with table in database.
-   \*.service.ts: Handling business logic.
-   \*.middleware.ts
-   \*.controller.ts: Handling incoming request and return response to client.
-   \*.route.ts: Define how an application’s endpoints (URIs) respond to client requests
