import { HttpModule } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Collection, Db } from 'mongodb';
import { concatMap, forkJoin, from, map, take, tap } from 'rxjs';
import { makeContext } from '../../../functions/context';
import { DbLoggerMainFields } from '../../../interfaces/db-logger';
import { DOTA_DBLOGGER } from '../../constants';
import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, MATCHES } from '../../database/database.provider';
import { OpenDotaMatch } from '../../interfaces/open-dota-match';
import { OpenDotaService } from '../../services/open-dota.service';
import { LiveMatchStore } from '../live-match.store';
import { MatchesStore } from '../matches.store';

/**
 * testing=true npx jest ./matches.store.spec.ts --forceExit --verbose
 */

describe('MatchesStore', () => {
  let service: MatchesStore;
  let logger: Collection<DbLoggerMainFields>;
  let col: Collection<OpenDotaMatch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      providers: [MatchesStore, OpenDotaService, LiveMatchStore]
    })
      .setLogger(new Logger())
      .compile();

    logger = module.get<Db>(DATABASE_CONNECTION).collection(DOTA_DBLOGGER);
    col = module.get(MATCHES);
    service = module.get<MatchesStore>(MatchesStore);
  });

  it('should parse match succesfully then upsert to db', done => {
    const match_id: string = '6349819003';
    forkJoin([
      service.parse$(match_id, makeContext(logger)).pipe(
        tap(data => {
          expect(data.status == 'success').toBe(true);
        })
      ),
      service.processed$.pipe(
        concatMap(data => {
          if (data.status == 'success') {
            return from(col.findOne({ match_id: Number(match_id) }).then(doc => expect(doc).toBeTruthy()));
          }
        }),
        take(1)
      )
    ]).subscribe({
      complete: () => done()
    });
  });

  it('should live match db and throw fake match_id ', done => {
    service
      .liveMatchOnlyParse$('123', makeContext(logger))
      .pipe(
        tap(data => {
          console.log(data);
        })
      )
      .subscribe({
        next: v => {
          console.log('v', v);
        },
        error: err => {
          console.log(err);
          expect(err).toHaveProperty('err');
          expect(err).toHaveProperty('msg');
          expect(err.msg.toString()).toBe('record not found');
          done();
        },
        complete: () => {}
      });
  });

  it('should live match db and throw fake match_id ', done => {
    forkJoin([
      service.processed$.pipe(
        tap(data => {
          expect(data.status).toBe('success');
        }),
        take(1)
      ),
      service.liveMatchOnlyParse$('6349819003', makeContext(logger))
    ]).subscribe({
      complete: () => done()
    });
  });

  it('should emit all matches in the collection thru the processed pipe', done => {
    forkJoin([
      service.emitAll(makeContext(logger)),
      service.processed$.pipe(
        map(data => {
          expect(data.status == 'success').toBe(true);
          if (data.status == 'success') {
            expect(data.payload.match_id).toBeTruthy();
          }
        }),
        take(1)
      )
    ]).subscribe({
      complete: () => done()
    });
  });
});
