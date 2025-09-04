import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScannerState {
  selectedEvent: Record<string, any>;
  selectedDay: number;
  scanReady: boolean;
  scanned: boolean;
  loading: boolean;
  lastScannedCode: string;
  scanDisabled: boolean;
  errorOccurred: boolean;
  errorMessage: string;
  showSuccess: boolean;
  successMessage: string;
  merchModalVisible: boolean;
  merchProcessing: boolean;
}

const initialState: ScannerState = {
  selectedEvent: {},
  selectedDay: 2, // Default to Tuesday
  scanReady: false,
  scanned: false,
  loading: false,
  lastScannedCode: '',
  scanDisabled: false,
  errorOccurred: false,
  errorMessage: '',
  showSuccess: false,
  successMessage: '',
  merchModalVisible: false,
  merchProcessing: false,
};

const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<Record<string, any>>) => {
      state.selectedEvent = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<number>) => {
      state.selectedDay = action.payload;
    },
    setScanReady: (state, action: PayloadAction<boolean>) => {
      state.scanReady = action.payload;
    },
    setScanned: (state, action: PayloadAction<boolean>) => {
      state.scanned = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLastScannedCode: (state, action: PayloadAction<string>) => {
      state.lastScannedCode = action.payload;
    },
    setScanDisabled: (state, action: PayloadAction<boolean>) => {
      state.scanDisabled = action.payload;
    },
    setErrorOccurred: (state, action: PayloadAction<boolean>) => {
      state.errorOccurred = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setShowSuccess: (state, action: PayloadAction<boolean>) => {
      state.showSuccess = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    setMerchModalVisible: (state, action: PayloadAction<boolean>) => {
      state.merchModalVisible = action.payload;
    },
    setMerchProcessing: (state, action: PayloadAction<boolean>) => {
      state.merchProcessing = action.payload;
    },
    resetScan: (state) => {
      state.scanned = false;
      state.showSuccess = false;
      state.scanReady = false;
      state.loading = false;
      state.lastScannedCode = '';
      state.scanDisabled = false;
      state.errorOccurred = false;
      state.errorMessage = '';
    },
    clearError: (state) => {
      state.errorOccurred = false;
      state.errorMessage = '';
      state.scanDisabled = false;
    },
  },
});

export const {
  setSelectedEvent,
  setSelectedDay,
  setScanReady,
  setScanned,
  setLoading,
  setLastScannedCode,
  setScanDisabled,
  setErrorOccurred,
  setErrorMessage,
  setShowSuccess,
  setSuccessMessage,
  setMerchModalVisible,
  setMerchProcessing,
  resetScan,
  clearError,
} = scannerSlice.actions;

export default scannerSlice.reducer;
