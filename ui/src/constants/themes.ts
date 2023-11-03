type Color = string;

type ColorScale = [string, string, string, string, string, string, string];

export type ThemeConfig = {
  colors: Record<string, Record<string, Color> | Color | ColorScale>;
  fonts: Record<string, any>;
  borderRadius: Record<string, any>;
};

const greyscale = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#CCCCCC',
  '#EEEEEE',
  '#FFFFFF',
] as ColorScale;

const LightTheme: ThemeConfig = {
  colors: {
    primary: '#102027',
    secondary: '#37474f',
    tertiary: '#62727b',
    border: '#BDBDBD',
    font: 'rgba(33,33,33,.7)',
    success: '#0F720B',
    error: '#AE2727',
    warning: '#EED202',
    tab_active_header: '#0070F0',
    greyscale: greyscale,
    controls: {
      background: '#fff',
    },
    components: {
      session_card_running_status: '#1271EE',
      session_card_active_bg: '#ABD2ED',
      session_card_default_bg: '#f0f4f7',
      log_entry_hover: '#fffdea',

      profiling_chart_system_cpu_border: 'rgb(194, 230, 153)',
      profiling_chart_system_cpu_background: 'rgba(194, 230, 153, 0.5)',
      profiling_chart_app_cpu_border: 'rgb(49, 163, 84)',
      profiling_chart_app_cpu_background: 'rgba(49, 163, 84, 0.5)',
      profiling_chart_system_memory_border: 'rgb(65, 182, 196)',
      profiling_chart_system_memory_background: 'rgba(65, 182, 196, 0.5)',
      profiling_chart_app_memory_border: 'rgb(34, 94, 168)',
      profiling_chart_app_memory_background: 'rgba(34, 94, 168, 0.5)',

      /* http logs component */
      http_logs_table_bg: 'transparent',
      http_logs_table_border: '#808080',
      http_logs_table_color: greyscale[1],
      http_logs_table_header_bg: '#292a2d',
      http_logs_table_header_color: '#dcdfe2',
      http_logs_table_row_hover: '#ABD2ED',
      http_logs_table_row_active: '#ABD2ED',
      http_logs_table_even_row_bg: '#f0f4f7',

      http_logs_table_icon_api: '#096e09',
      http_logs_table_icon_document: '#0d2ed7',
      http_logs_table_icon_script: '#a18809',

      http_logs_details_header_active: greyscale[2],
    },
  },
  fonts: {
    size: {
      M: '10px',
      L: '12px',
      XL: '14px',
      XXL: '16px',
    },
    weight: {
      M: '200',
      L: '400',
      XL: '500',
      XXL: '700',
    },
  },
  borderRadius: {
    M: '3px',
    L: '6px',
    XL: '12px',
    XXL: '24px',
  },
};

export default {
  light: LightTheme,
};

export const DEFAULT_THEME = 'light';
