import { Injectable, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppLogger } from '../../app.logger';

import { LEADERBOARD_CMD_CREATE, LEADERBOARD_CMD_UPDATE, LEADERBOARD_CMD_DELETE } from './leaderboard.constants';

@Controller()
export class LeaderboardListener {

    private logger = new AppLogger(LeaderboardListener.name);

    constructor() { }

    @MessagePattern({ cmd: LEADERBOARD_CMD_CREATE })
    public async onLeaderboardCreate(): Promise<void> {
        try {
            this.logger.debug(`[onLeaderboardCreate] Create leaderboard in Github repository`);
            // TODO
            this.logger.debug('[onLeaderboardCreate] Leaderboard created in Github repository');
        } catch (err) {
            this.logger.error(`[onLeaderboardCreate] Leaderboard NOT created in Github repository, because ${err.message}`, err.stack);
        }
    }

    @MessagePattern({ cmd: LEADERBOARD_CMD_UPDATE })
    public async onLeaderboardUpdate(): Promise<void> {
        try {
            this.logger.debug(`[onLeaderboardUpdate] Update leaderboard in Github repository`);
            // TODO
            this.logger.debug('[onLeaderboardUpdate] Leaderboard updated in Github repository');
        } catch (err) {
            this.logger.error(`[onLeaderboardUpdate] Leaderboard NOT updated in Github repository, because ${err.message}`, err.stack);
        }
    }

    @MessagePattern({ cmd: LEADERBOARD_CMD_DELETE })
    public async onLeaderboardDelete(): Promise<void> {
        try {
            this.logger.debug(`[onLeaderboardDelete] Update leaderboard in Github repository`);
            // TODO
            this.logger.debug('[onLeaderboardDelete] Leaderboard updated in Github repository');
        } catch (err) {
            this.logger.error(`[onLeaderboardDelete] Leaderboard NOT updated in Github repository, because ${err.message}`, err.stack);
        }
    }
}

