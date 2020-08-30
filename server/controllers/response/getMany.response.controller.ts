import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { ServerErrorService } from '@server/resources/server-error';

export default async function getMany(req: ExpressRequest, res: ExpressResponse) {
  let responses;

  if (req.params.intercept) {
    let intercept;
    try {
      intercept = await InterceptService.get(req.params.intercept);
    } catch (e) {
      return res.status(400).send(
        await ServerErrorService.create(
          'GET_RESPONSES_BY_INTERCEPT_BAD_ID',
          'The id provided for the intercept is not valid',
        ),
      );
    }
    if (!intercept) {
      return res.status(404).send();
    }

    intercept.populate('responses');
    await intercept.execPopulate();

    responses = intercept.responses;
  } else {
    responses = await ResponseService.getAll();
  }

  return res.send({ items: responses });
}
