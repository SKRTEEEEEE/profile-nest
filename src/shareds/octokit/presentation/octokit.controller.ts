import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { OctokitRepo } from "../infrastructure/octokit.service";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { Response } from "express";
// import { ChartService } from "src/shareds/chart/chart.service";
import { TopicChartUseCase } from "src/shareds/chart/application/topic-chart.usecase";

//test
@Controller("octokit")
export class OctokitController {
    // This controller can be used to define routes related to Octokit operations
    // For example, you can define endpoints to get repository details, update files, etc.
    // Currently, it is empty and can be expanded as needed.
    constructor(
        private readonly octokitRepository: OctokitRepo,
        // private readonly chartService: ChartService,
        private readonly topicChartUseCase: TopicChartUseCase,

    ) {
        // Constructor can be used to inject services or perform initialization
    }
        @Get('pie/:owner')
    @PublicRoute()
    async getPieChart(
        @Param('owner') username: string,
        @Res() res: Response,
        @Query('top') top?: string
    ) {
        console.log('Fetching repositories for user:', username);
        const repos = await this.octokitRepository.getReposDetails(username);
        // const data1 = this.octokitRepository['getAllTopicsSizePercentage'](repos);
        // const data2 = this.octokitRepository["getAllTopicsRepoPercentage"](repos)
        // const buffer = await this.chartService.renderBarChart(username,data1, data2);
        const buffer = await this.topicChartUseCase.renderTopicAlphaBarChart(username,"alpha-triple",repos)
        res.setHeader('Content-Type', 'image/svg+xml');
        // res.setHeader('Cache-Control', 'public, max-age=604800');//Añadir una vez terminado - ⚠️🧠 Crear también cache interna
        res.send(buffer);
    }
    //     @Get('pie/:owner')
    // @PublicRoute()
    // async getPieChart(
    //     @Param('owner') username: string,
    //     @Res() res: Response,
    //     @Query('top') top?: string
    // ) {
    //     console.log('Fetching repositories for user:', username);
    //     const repos = await this.octokitRepository.getReposDetails(username);
    //     const data1 = this.octokitRepository['getAllTopicsSizePercentage'](repos);
    //     const data2 = this.octokitRepository["getAllTopicsRepoPercentage"](repos)
    //     const buffer = await this.chartService.renderBarChart(username,data1, data2);

    //     res.setHeader('Content-Type', 'image/svg+xml');
    //     // res.setHeader('Cache-Control', 'public, max-age=604800');//Añadir una vez terminado - ⚠️🧠 Crear también cache interna
    //     res.send(buffer);
    // }


    @Get("details/:owner")
    @PublicRoute()
    async testGetRepos(@Param("owner") owner: string) {
        // This endpoint can be used to get repository details for a given owner
        // It calls the getReposDetails method from the OctokitRepo service
        return await this.octokitRepository.getReposDetails(owner);
        
    }
    // @Get("commits/:owner")
    // @PublicRoute()
    // async getCommitsPercentageByAllLanguages(@Param("owner") owner: string) {
    //     return await this.octokitRepository.getCommitsPercentageByAllLanguages(owner);
    // }

    @Get("test/:tech")
    @PublicRoute()
    async test( @Param("tech") tech: string) {
        return this.octokitRepository.getTopicGithubData(tech,"SKRTEEEEEE");
    }


    // @Get("percentage/:owner/:tech")
    // @PublicRoute()
    // async testGetTechGithubPercentage(@Param("owner") owner: string, @Param("tech") tech: string) {
    //     // This endpoint can be used to get repository details for a given owner
    //     // It calls the getReposDetails method from the OctokitRepo service
    //     return await this.octokitRepository.getTechGithubPercentage(tech,owner);
        
    // }


}