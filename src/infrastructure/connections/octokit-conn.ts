import { Octokit } from "@octokit/rest";
import { SetEnvError } from "src/domain/errors/domain.error";

export abstract class OctokitConfig{
    private auth = process.env.GITHUB_TOKEN
    private _octokit;

    constructor(){
        this._octokit = this.initialize()
    }

    private initialize(){
        if(!this.auth)throw new SetEnvError("github token")
        return new Octokit({auth: this.auth})
    }
    protected get octokit(){
        return this._octokit
    }
}