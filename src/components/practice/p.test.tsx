import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import App from "./p";

describe('p',()=>{
    //for every test
    //api mock setup
    beforeEach(()=>{
        global.fetch =jest.fn();
    })

      afterEach(()=>{
        jest.clearAllMocks();
    })
    //api mocks

    test('()=>{

    })

})