export interface DemoMeta {
  root_path: string;
  demo_file: string;
  demo_folder: string;
  data_folder: string;
}

export function getDemoPath({
  root_path,
  demo_file,
  demo_folder
}: DemoMeta): string {
  return `${root_path + demo_folder + demo_file}.dem`;
}
