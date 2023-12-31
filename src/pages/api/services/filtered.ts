import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../queries/services';
import { ServiceStatusEnum } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;

  // @dev : here you can add optional additional filters, example in ./filter.json
  const keywordList: string[] = [];

  const serviceStatus = query.serviceStatus as ServiceStatusEnum;
  const buyerId = query.buyerId as string;
  const sellerId = query.sellerId as string;
  const numberPerPage = Number(query.numberPerPage);
  const offset = Number(query.offset);
  const searchQuery = query.searchQuery as string;

  try {
    const response = await getServices({
      serviceStatus,
      buyerId,
      sellerId,
      numberPerPage,
      offset,
      keywordList,
      searchQuery,
    });

    const filteredServices = response?.data?.data?.services;

    res.status(200).json({ services: filteredServices });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
