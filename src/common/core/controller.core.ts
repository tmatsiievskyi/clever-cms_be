import { TApiResponse } from '@common/types';

export abstract class ControllerCore {
  protected formatSuccessResp<T>({
    data: result,
    time,
    message,
    respTotal,
    currentPage,
    totalPages,
  }: {
    data: any;
    time?: number;
    message?: string;
    respTotal?: number;
    currentPage?: number;
    totalPages?: number;
  }) {
    let numRecords = 0;
    let data = null;
    let total = 0;

    if (result && result instanceof Array) {
      numRecords = result.length;
      data = result;
    } else if (result && typeof result === 'object') {
      data = result.items ?? result;
      total = respTotal
        ? respTotal
        : Array.isArray(result?.metadata)
          ? result.metadata[0].totalCount
          : 1;
      numRecords = result.items?.length ?? 1;
    } else if (result || result === 0) {
      numRecords = 1;
      data = result;
    }

    const resp: TApiResponse<T> = {
      data,
      message: message ? message : null,
      meta: {
        length: numRecords,
        took: time,
        total: total ? total : numRecords,
        currentPage,
        totalPages,
      },
    };

    return JSON.stringify(resp);
  }
}
