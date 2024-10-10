import { DatabaseServicesModule } from "./database";
import { HealthServicesModule } from "./health";
import { PostServicesModule } from "./post";
import { UserServicesModule } from "./user/user.module";
import { UtilsServicesModule } from "./utils";

export default [
    DatabaseServicesModule,
    UtilsServicesModule,
    PostServicesModule,
    UserServicesModule,
    HealthServicesModule
]