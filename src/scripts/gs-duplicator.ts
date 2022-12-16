import { editPipelineSchedulePage, pipelineSchedulesPage } from '@/pages';
import { isEditPipelineScheduleUrl, isPipelineScheduleUrl } from '@/shared';

const RUN_SCRIPT_AFTER_MS = 500;

const main = async () => {
  const url = window.location.href;

  if (isPipelineScheduleUrl(url)) {
    setTimeout(pipelineSchedulesPage, RUN_SCRIPT_AFTER_MS);
  } else if (isEditPipelineScheduleUrl(url)) {
    setTimeout(editPipelineSchedulePage, RUN_SCRIPT_AFTER_MS);
  }
};

(async () => {
  try {
    main();
  } catch (error) {
    console.error(error);
  }
})();

export {};
