import { OPENDOTA_BASE_URL } from './constants';
import { SyncController } from './controllers/sync.controller';
import { DotaConstantsController } from './controllers/dota-constants.controller';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { MatchesStore } from './data-stores/matches.store';
import { HttpModule } from '@nestjs/axios';
import { LiveMatchStore } from './data-stores/live-match.store';
import { LevelTwoMatchesStore } from './data-stores/level-two-matches.store';
import { OpenDotaService } from './services/open-dota.service';
import { ConstantsStore } from './data-stores/constants.store';
import { TaskSchedulerService } from './services/task-scheduler/task-scheduler.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [DotaConstantsController, SyncController],
  providers: [OpenDotaService, TaskSchedulerService, LiveMatchStore, MatchesStore, LevelTwoMatchesStore, ConstantsStore]
})
export class DotaTrendsModule {}
