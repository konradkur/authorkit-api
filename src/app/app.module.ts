import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { config } from '../config';
import { AuthModule } from './auth/auth.module';
import { AppLogger } from './app.logger';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { ProjectModule } from './project/project.module';
import { PermissionModule } from './permissions/permission.module';
import { ExerciseModule } from './exercises/exercise.module';
import { GamificationLayerModule } from './gamification-layers/gamification-layer.module';
import { ChallengeModule } from './gamification-layers/challenges/challenge.module';
import { LeaderboardModule } from './gamification-layers/leaderboards/leaderboard.module';
import { RewardModule } from './gamification-layers/rewards/reward.module';
import { RuleModule } from './gamification-layers/rules/rule.module';
import { GqlConfigService, RequestContextMiddleware } from './_helpers';
import { ProjectController } from './project/project.controller';
import { TestSetModule } from './testsets/testset.module';
import { TestModule } from './tests/test.module';
import { DynamicCorrectorModule } from './dynamic-correctors/dynamic-corrector.module';
import { EmbeddableModule } from './embeddables/embeddable.module';
import { FeedbackGeneratorModule } from './feedback-generators/feedback-generator.module';
import { InstructionModule } from './instructions/instruction.module';
import { LibraryModule } from './libraries/library.module';
import { SolutionModule } from './solutions/solution.module';
import { StatementModule } from './statements/statement.module';
import { StaticCorrectorModule } from './static-correctors/static-corrector.module';
import { TemplateModule } from './templates/template.module';
import { TestGeneratorModule } from './test-generators/test-generator.module';
import { SkeletonModule } from './skeletons/skeleton.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(config.database),
        CommandModule,
        HealthCheckModule,
        AuthModule,
        PermissionModule,
        UserModule,
        ProjectModule,
        ExerciseModule,
        TestSetModule,
        TestModule,
        DynamicCorrectorModule,
        EmbeddableModule,
        FeedbackGeneratorModule,
        InstructionModule,
        LibraryModule,
        SkeletonModule,
        SolutionModule,
        StatementModule,
        StaticCorrectorModule,
        TemplateModule,
        TestGeneratorModule,
        GamificationLayerModule,
        ChallengeModule,
        LeaderboardModule,
        RewardModule,
        RuleModule,
        GraphQLModule.forRootAsync({
            imports: [SharedModule, UserModule],
            useClass: GqlConfigService
        })
    ]
})
export class AppModule {
    private logger = new AppLogger(AppModule.name);

    constructor() {
        this.logger.log('Initialize constructor');
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestContextMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
