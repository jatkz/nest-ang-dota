import { Filter, FindOptions } from "mongodb";
import { Body, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "../../guards/authentication.guard";
import { AdminGuard } from "../../guards/admin.guard";
import { ConstantsRepo } from "../repositories/constants.repo";

@Controller("dota-constants")
@UseGuards(AuthenticationGuard)
export class DotaConstantsController {
  constructor(private constantsRepo: ConstantsRepo) {}

  /**
   * query heroes basic data, id, name, picture cdn-links, attributes, health
   * @param query
   * @param simple flag to send a predefined options for a query
   * @returns
   */
  @Get("heroes")
  @UseGuards(AdminGuard)
  getHeroes(@Query("simple") simple?: boolean) {
    const query: Filter<any> = {};
    const findOptions: FindOptions = {};
    console.log("simple", simple);
    if (simple) {
      findOptions.projection = heroesSimpleFields;
    }
    return this.constantsRepo.get("heroes", query, findOptions);
  }

  /**
   * query individual hero basic data, id, name, picture cdn-links, attributes, health
   * @param query
   * @param simple flag to send a predefined options for a query
   * @returns
   */
  @Get("hero/:id")
  @UseGuards(AdminGuard)
  getHero(@Query("simple") simple?: boolean, @Param("id") id?: string) {
    const query: Filter<any> = { id };
    const findOptions: FindOptions = {};
    if (simple) {
      findOptions.projection = heroesSimpleFields;
    }
    return this.constantsRepo.get("heroes", query, findOptions);
  }
}

const heroesSimpleFields = {
  _id: 0,
  id: 1,
  name: 1,
  localized_name: 1,
  img: 1,
  icon: 1
};
