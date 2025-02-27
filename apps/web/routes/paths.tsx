const ROOTS = {
  DEPARTMENT: "/departments",
  TREASURY: "/treasury",
  PARTICIPANT: "/participants",
};

export const PATHS = {
  DEPARTMENT: {
    HOME: `${ROOTS.DEPARTMENT}`,
    ADD: `${ROOTS.DEPARTMENT}/add`,
    EDIT: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
  },

  TREASURY: {
    HOME: `${ROOTS.TREASURY}`,
    ADD: `${ROOTS.TREASURY}/add`,
    EDIT: (cuid: string) => `${ROOTS.TREASURY}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.TREASURY}/${cuid}`,
  },

  PARTICIPANT: {
    HOME: `${ROOTS.PARTICIPANT}`,
    ADD: `${ROOTS.PARTICIPANT}/add`,
    DETAILS: (cuid: string) => `${ROOTS.PARTICIPANT}/${cuid}`,
  },
};
