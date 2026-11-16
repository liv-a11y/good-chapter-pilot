const themes = [
  { label: 'cooking and kitchen', terms: 'cook cooking kitchen bake baking bread toaster cutting board cookware skillet pan' },
  { label: 'tools and home projects', terms: 'tool tools toolkit toolbox repair repairs diy hardware drill hammer wrench project projects worklight work light' },
  { label: 'coffee and tea', terms: 'coffee tea espresso kettle mug mugs cup cups' },
  { label: 'lighting and reading', terms: 'reading reader book books lamp lamps lighting light' },
  { label: 'cleaning and upkeep', terms: 'clean cleaning vacuum broom dust mop upkeep' },
  { label: 'gardening and plants', terms: 'gardening garden plants planter pots seeds watering' },
  { label: 'small spaces and organization', terms: 'storage organize organization compact small apartment basket bins shelf' },
].map(theme => ({ ...theme, words: new Set(theme.terms.split(' ')) }));

function words(text) {
  return new Set((text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(word => word.length > 2));
}

function overlap(left, right) {
  return [...left].filter(word => right.has(word)).length;
}

export function suggestGifts(catalog, { notes, avoid, guestBudget, anchorBudget }) {
  const positive = [];
  const negative = [avoid];
  for (const part of notes.split(/[.;,\n]|\bbut\b/i)) {
    const exclusion = part.match(/\b(?:already (?:has|owns|have|own|got)|(?:doesn['’]t|don['’]t) (?:need|want)|avoid|skip|no need for)\s+(.+)/i);
    if (exclusion) {
      positive.push(part.slice(0, exclusion.index));
      negative.push(exclusion[1].split(/\b(?:and (?:likes|loves|needs|wants|keeps)|so|because)\b/i)[0]);
    } else positive.push(part);
  }
  const interests = words(positive.join(' '));
  const excluded = words(negative.join(' '));
  const activeThemes = themes.filter(theme => overlap(interests, theme.words));
  const ranked = catalog.filter(gift => Number.isFinite(gift.amount)).flatMap(gift => {
    const title = words(gift.title);
    if (overlap(title, excluded)) return [];
    const keywords = words([gift.title, gift.productType, ...(gift.tags ?? [])].filter(Boolean).join(' '));
    const matching = activeThemes.filter(theme => overlap(keywords, theme.words));
    const direct = overlap(interests, keywords);
    const score = direct * 3 + matching.length * 2;
    const reason = matching.length ? 'Matches your note about ' + matching[0].label + '.'
      : direct ? 'Matches a detail you mentioned.' : 'Fits the budget you entered.';
    if (!score && guestBudget === null && anchorBudget === null) return [];
    return [{ ...gift, score, reason }];
  }).sort((left, right) => right.score - left.score || left.amount - right.amount);

  const anchor = anchorBudget === null ? undefined : ranked.find(gift =>
    gift.amount <= anchorBudget && (guestBudget === null || gift.amount > guestBudget));
  const guests = ranked.filter(gift => gift.id !== anchor?.id
    && (guestBudget === null ? gift.score > 0 : gift.amount <= guestBudget)).slice(0, 5);
  return [
    ...(anchor ? [{ ...anchor, reason: 'Organizer gift · ' + anchor.reason }] : []),
    ...guests,
  ];
}
