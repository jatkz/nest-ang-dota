import { Filter, FindOptions } from 'mongodb';
import { Body, Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { ConstantsStore } from '../data-stores/constants.store';
import { payloadify } from '../../misc';

@Controller('dota-constants')
// @UseGuards(AuthenticationGuard)
export class DotaConstantsController {
  constructor(@Inject(ConstantsStore) private constants: ConstantsStore) {}

  /**
   * query heroes basic data, id, name, picture cdn-links, attributes, health
   * @param query
   * @param simple flag to send a predefined options for a query
   * @returns
   */
  @Get('heroes')
  // @UseGuards(AdminGuard)
  getHeroes(@Query('simple') simple?: boolean) {
    const query: Filter<any> = {};
    const findOptions: FindOptions = {};
    if (simple) {
      findOptions.projection = heroesSimpleFields;
    }
    return payloadify(this.constants.get('heroes', query, findOptions));
  }

  /**
   * query individual hero basic data, id, name, picture cdn-links, attributes, health
   * @param query
   * @param simple flag to send a predefined options for a query
   * @returns
   */
  @Get('hero/:id')
  // @UseGuards(AdminGuard)
  getHero(@Query('simple') simple?: boolean, @Param('id') id?: string) {
    const query: Filter<any> = { id };
    const findOptions: FindOptions = {};
    if (simple) {
      findOptions.projection = heroesSimpleFields;
    }
    return payloadify(this.constants.get('heroes', query, findOptions));
  }
}

const heroesSimpleFields = {
  _id: 0,
  id: 1,
  name: 1,
  localized_name: 1,
  // img: 1,
  icon: 1
};
