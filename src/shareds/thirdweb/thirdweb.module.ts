import { Module } from "@nestjs/common";
import { AuthThirdwebRepo } from "./auth-thirdweb.repo";

@Module({
    providers: [
        AuthThirdwebRepo
    ],
    exports:[
        AuthThirdwebRepo
    ]
})
export class ThirdWebModule{}