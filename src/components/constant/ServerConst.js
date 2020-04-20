import _ from "lodash";

export const PLAN_LABEL="plan"
export const PLAN_TYPE = {
    FREE: 'free',
    PRO: 'pro'
}
export function getPlanStr(planType){
    if(planType===PLAN_TYPE.FREE){
        return 'Miễn phí'
    }
    else if(planType===PLAN_TYPE.PRO){
        return 'Có phí'
    }
    else{
        return 'Text Not define'
    }
}

export const planOptions = _.map(PLAN_TYPE, (value, index) => {
    return {
      key: value,
      value: value,
      text: getPlanStr(value),
    };
  });