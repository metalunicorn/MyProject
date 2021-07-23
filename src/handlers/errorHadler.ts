import { Request, Response, NextFunction} from 'express';

export const catchErrors = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<any>
) =>
  function catchAllErrors(req:Request, res:Response, next:NextFunction ) {
    fn(req, res, next).catch((err: string) => {
      if (typeof err === 'string') {
        res.status(400).json({
          message: err,
        });
      } else {
        // eslint-disable-next-line promise/no-callback-in-promise
        next();
      }
    });
  };

export const mongoseErrors = function handlerMongooseErrors(
  req: Request,
  res: Response,
  next: NextFunction
):void {
  if (!req) {
    return next(req);
  }

  const errorKeys = Object.keys(req);
  let message = '';
  // eslint-disable-next-line no-return-assign
  errorKeys.forEach((key) => (message += `${req}, `));

  message = message.substr(0, message.length - 2);

  res.status(400).json({
    message,
  });
};

export const developmentErrors = function handlerDevelopmentErrors(
  res: Response
):any {
  // eslint-disable-next-line no-param-reassign
  res.status(500).json({
    message: 'AAAAAAA',
  });
};

export const productionErrors = function handlerProductionErrors(
  res: Response
) {
  return res.status(500).json({
    message: 'Internal Server Error?',
  });
};

export const notFound = function handlerNotFound(res: Response) {
  res.status(404).json({
    message: 'Route not found',
  });
};
