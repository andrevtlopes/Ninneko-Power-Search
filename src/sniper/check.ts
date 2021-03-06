import { CommandInteraction } from 'discord.js';
import User from '../models/user.model';
import { importantPartArray, partTypes } from '../parts';
import { byId, getPartName } from '../searchHelper';

export default async function check(
    user: User,
    interaction: CommandInteraction
): Promise<void> {
    await interaction.editReply({
        content: await checkSnipe(user),
    });
}

const checkSnipe = async (user: User): Promise<string> => {
    const snipes = await user.getSnipes();
    if (snipes.length > 0) {
        const snipeArray = [];
        for (const snipe of snipes) {
            const fields = importantPartArray.map(
                (part) =>
                    `${byId(partTypes, part.id)?.toUpperCase()}: ${getPartName(
                        (snipe as any)[part.name + 'D']
                    )} | ${getPartName(
                        (snipe as any)[part.name + 'R']
                    )} | ${getPartName((snipe as any)[part.name + 'R1'])}`
            );
            snipeArray.push(`**${snipe.name}**\n${fields.join('\n')}`);
        }
        return snipeArray.join('\n');
    }

    return 'No snipes to check';
};
