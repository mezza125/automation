import { getExcelContent } from "./file-utils";
import { getEncryptedPassword } from "./password-utils";
import request from "supertest";

let data: { id: string; name: string; abilities: string }[] = getExcelContent(
  "src/Datos-pruebas.xlsx"
);

describe("Pokeapi", () => {
  const baseURL = "https://pokeapi.co/";

  beforeEach(async () => {
    console.log("encrypted password", getEncryptedPassword());
  });

  data.forEach((pokemon) => {
    test(`GET /pokemon/${pokemon.name}`, async () => {
      const starTime = Date.now();
      const response = await request(baseURL).get(
        `api/v2/pokemon/${pokemon.id}`
      )
      const endTime = Date.now();

      expect(response.status).toBe(200);
      // assert the response time is less than 10 seconds
      expect(endTime - starTime).toBeLessThan(10000);

      expect(response.body).toHaveProperty("id", pokemon.id);
      expect(response.body).toHaveProperty("name", pokemon.name);

      const expectedAbilities = pokemon.abilities.split(',').map(ability => ability.trim());
      const responseAbilities = response.body.abilities.map((ability: any) => ability.ability.name);

      expect(responseAbilities).toEqual(expect.arrayContaining(expectedAbilities));
      expect(expectedAbilities).toEqual(expect.arrayContaining(responseAbilities));
    });
  });
});
