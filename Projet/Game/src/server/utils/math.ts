export function getMaxRounds(participantCount: number): number {
	if (participantCount <= 1)
		return 0;
	return Math.ceil(Math.log2(participantCount))+1;
}
