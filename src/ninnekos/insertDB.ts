import { GraphQLClient } from 'graphql-request';
import Ninneko from '../models/ninneko.model';
import query from '../query/index';

export default async function insertDB(
    pet: any,
    graphClient: GraphQLClient,
    soldPrice: number | null,
    soldAt: Date | null,
    listedPrice: number | null,
    listedAt: Date | null
) {
    let recently: any = { };
    if (soldPrice && soldAt) {
        recently = { soldAt, soldPrice, listedAt: null, listedPrice: null };
    } else if (listedPrice && listedAt) {
        recently = { listedPrice, listedAt };
    } else {
        const history = await graphClient.request(query.saleHistory, {
            id: pet.id,
        });

        let listed = { listedAt: null, listedPrice: null };
        
        if (pet.updatedAt && pet.forSale === 1) {
            recently = { listedAt: pet.updatedAt, listedPrice: pet.price };
        }

        for (const s of history.saleHistory) {
            soldAt = new Date(s.createdAt);
            if (!recently?.soldAt) {
                recently = { ...listed, soldAt, soldPrice: s.price };
            } else if (soldAt.getTime() > recently.soldAt.getTime()) {
                recently = { ...listed, soldAt, soldPrice: s.price };
            }
        }
    }
    await Ninneko.upsert({ ...pet, ...recently });
}
