import React from 'react'
import { PLAN_TYPE } from '../../constant/ServerConst';

export default function Plan({plan}) {
    if (plan === PLAN_TYPE.PRO) {
      return <span className="planStyle">{plan}</span>;
    }
    return <div />;
  }