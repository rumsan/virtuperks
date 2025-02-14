const ROOTS = {
  DEPARTMENT: "/departments",
  TREASURER: "/treasurer",
  TASKS: "/tasks",
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

  TASKS: {
    HOME: `${ROOTS.TASKS}`,
    ADD: `${ROOTS.TASKS}/add`,
    DETAILS: (cuid: string) => `${ROOTS.TASKS}/${cuid}`,
  },
};
