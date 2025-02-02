const ROOTS = {
  DEPARTMENT: "/departments",
  TREASURER: "/treasurer",
  PARTICIPANT: "/participants",
};

export const PATHS = {
  DEPARTMENT: {
    HOME: `${ROOTS.DEPARTMENT}`,
    ADD: `${ROOTS.DEPARTMENT}/add`,
    EDIT: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
  },

  TREASURER: {
    HOME: `${ROOTS.TREASURER}`,
    ADD: `${ROOTS.TREASURER}/add`,
    EDIT: (cuid: string) => `${ROOTS.TREASURER}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.TREASURER}/${cuid}`,
  },

  PARTICIPANT: {
    HOME: `${ROOTS.PARTICIPANT}`,
    ADD: `${ROOTS.PARTICIPANT}/add`,
    DETAILS: (cuid: string) => `${ROOTS.PARTICIPANT}/${cuid}`,
  },
};
