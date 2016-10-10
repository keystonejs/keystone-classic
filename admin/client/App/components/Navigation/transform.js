export function transformMenu(sections, abilities) {
  const {isAdmin} = Keystone.user;
  return sections.map((section) => {
    if (isAdmin) {
      return section;
    }

    const lists = section.lists.filter((l) => {
      return abilities.indexOf(l.key) !== -1;
    });
    return Object.assign({}, section, {
      lists
    });
  }).filter((section) => {
    return section.lists.length > 0
  });
}