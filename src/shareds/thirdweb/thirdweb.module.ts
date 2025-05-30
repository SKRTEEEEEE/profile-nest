import { Module } from "@nestjs/common";
import { AuthThirdWebRepo } from "./auth-thirdweb.repo";

@Module({
    providers: [
        AuthThirdWebRepo
    ],
    exports:[
        AuthThirdWebRepo
    ]
})
export class ThirdWebModule{}