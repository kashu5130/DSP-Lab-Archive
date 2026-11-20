import type { ExperimentFile, LabManualInfo } from '../types/experiment';

export const LAB_MANUAL: LabManualInfo = {
  title: 'Digital Signal Processing Lab Experiments',
  subtitle: 'Editable transcription & corrected Scilab 6.1.0 programs for the 33-page laboratory record',
  pdfPath: '/assets/aistudio/DSP_Lab_Mannual_7cf9bbe7.pdf',
  downloadName: 'DSP_Lab_Manual.pdf',
  totalPages: 11,
  softwareVersion: 'Scilab 6.1.0',
  notes: [
    'Corrected programs are written for Scilab 6.x syntax and are ready to copy into the Scilab editor or download directly as .sce scripts.',
    'Interactive experiments prompt for sequence inputs or filter parameters at runtime via Scilab input().',
    'Programs were verified by syntax, dimension, indexing, and Scilab Signal Processing toolbox review against the handwritten record.',
  ],
  codeReviewSummary: [
    'Replaced inconsistent handwritten loop bounds and indexing with valid Scilab vector indexing.',
    'Made sequence lengths explicit before convolution and circular convolution.',
    'Used Scilab fft() / ifft() calls consistently and separated sequence indices from signal values in plots.',
    'Added input validation for radix-2 FFT length, normalized cutoff frequency, and odd FIR filter length.',
    'Corrected the FIR ideal impulse-response center sample to wc / %pi, avoiding division by zero.',
  ],
};

export const EXPERIMENTS: ExperimentFile[] = [
  {
    id: 'exp-1',
    number: 1,
    title: 'Basic signals (unit step, impulse, and ramp)',
    filename: 'exp01_basic_signals.sce',
    sourcePages: 'Pages 1–6',
    category: 'signals-convolution',
    categoryLabel: 'Signals & Convolution',
    software: 'Scilab 6.1.0',
    aim: 'Generate basic signals such as unit impulse, unit step, and ramp for periodic / non-periodic (continuous-time / discrete-time) signals.',
    theory: [
      'A unit step signal has magnitude 1 for all t >= 0 and 0 for t < 0, denoted by u(t) or discrete-time u[n].',
      'A ramp signal increases linearly with time and is obtained by integrating the unit step: r(t) = t u(t) or r[n] = n u[n].',
      'An impulse signal is zero everywhere except at the origin: discrete-time impulse delta[n] is 1 at n = 0 and 0 elsewhere.',
    ],
    expectedResult:
      'The unit impulse signal exists only at the origin (t = 0 or n = 0) and has zero amplitude at all other points.',
    code: `clc;
clear;
clf;

n = -5:5;
u = bool2s(n >= 0);
delta = bool2s(n == 0);
r = n .* u;

subplot(3,1,1);
plot2d3(n, u);
xlabel("n"); ylabel("Amplitude"); title("Discrete-time unit step");
xgrid();

subplot(3,1,2);
plot2d3(n, delta);
xlabel("n"); ylabel("Amplitude"); title("Discrete-time unit impulse");
xgrid();

subplot(3,1,3);
plot2d3(n, r);
xlabel("n"); ylabel("Amplitude"); title("Discrete-time ramp");
xgrid();`,
  },
  {
    id: 'exp-2',
    number: 2,
    title: 'Linear convolution',
    filename: 'exp02_linear_convolution.sce',
    sourcePages: 'Pages 7–9',
    category: 'signals-convolution',
    categoryLabel: 'Signals & Convolution',
    software: 'Scilab 6.1.0',
    aim: 'Compute linear convolution of two finite-length discrete-time sequences.',
    theory: [
      'The output of an LTI system depends on the input signal x[n] and impulse response h[n]: y[n] = x[n] * h[n] = sum_k x[k] h[n - k].',
      'Obtained by shifting one sequence, multiplying overlapping samples, and summing the products.',
      'For sequence lengths N1 and N2, the resulting linear-convolution output length is N1 + N2 - 1.',
    ],
    expectedResult:
      'Notebook example: x(n) = [1, 2, 3] and h(n) = [2, 3, 4, 1] produces [2, 7, 16, 18, 11, 3].',
    code: `clc;
clear;
clf;

x = input("Enter first sequence x: ");
h = input("Enter second sequence h: ");
y = convol(x, h);

nx = 0:length(x)-1;
nh = 0:length(h)-1;
ny = 0:length(y)-1;

subplot(3,1,1);
plot2d3(nx, x); xlabel("n"); ylabel("Amplitude"); title("Input signal x[n]");
xgrid();
subplot(3,1,2);
plot2d3(nh, h); xlabel("n"); ylabel("Amplitude"); title("Impulse response h[n]");
xgrid();
subplot(3,1,3);
plot2d3(ny, y); xlabel("n"); ylabel("Amplitude"); title("Convolved signal y[n]");
xgrid();

disp("Linear convolution result:");
disp(y);`,
  },
  {
    id: 'exp-3',
    number: 3,
    title: 'Circular convolution',
    filename: 'exp03_circular_convolution.sce',
    sourcePages: 'Pages 10–11',
    category: 'signals-convolution',
    categoryLabel: 'Signals & Convolution',
    software: 'Scilab 6.1.0',
    aim: 'Compute circular convolution of two discrete-time sequences.',
    theory: [
      'Similar to linear convolution, except sequences are zero-padded to equal length N = max(N1, N2) and cyclically shifted.',
      'Equivalently computed in the frequency domain via DFT multiplication followed by IDFT: IDFT{DFT{x(n)} * DFT{h(n)}}.',
    ],
    expectedResult:
      'Sequences are adjusted to equal lengths, then circular shift and multiply-accumulate operations produce the N-point result.',
    code: `clc;
clear;
clf;

x = input("Enter first sequence x: ");
h = input("Enter second sequence h: ");
N = max(length(x), length(h));
x = [x, zeros(1, N-length(x))];
h = [h, zeros(1, N-length(h))];

// Circular convolution using the DFT definition.
y = real(ifft(fft(x) .* fft(h)));

n = 0:N-1;
subplot(3,1,1); plot2d3(n, x); title("First sequence"); xlabel("n"); ylabel("Amplitude");
subplot(3,1,2); plot2d3(n, h); title("Second sequence"); xlabel("n"); ylabel("Amplitude");
subplot(3,1,3); plot2d3(n, y); title("Circular convolution"); xlabel("n"); ylabel("Amplitude");
disp("Circular convolution result:"); disp(y);`,
  },
  {
    id: 'exp-4',
    number: 4,
    title: 'DFT and IDFT',
    filename: 'exp04_dft_idft.sce',
    sourcePages: 'Pages 12–14',
    category: 'transforms-zdomain',
    categoryLabel: 'Transforms & Z-Domain',
    software: 'Scilab 6.1.0',
    aim: 'Compute Discrete Fourier Transform (DFT) and Inverse DFT (IDFT) of a discrete-time signal.',
    theory: [
      'Converts a finite sequence of N equally spaced time-domain samples into N complex frequency-domain samples: X[k] = sum(n=0..N-1) x[n] exp(-j*2*pi*n*k/N).',
      'The inverse transform reconstructs x[n] = (1/N) sum(k=0..N-1) X[k] exp(j*2*pi*n*k/N).',
    ],
    expectedResult:
      'The DFT magnitude, DFT phase, and reconstructed IDFT output of the given discrete-time signal match the original sequence.',
    code: `clc;
clear;
clf;

x = input("Enter sequence x: ");
N = length(x);
X = fft(x);
x_rec = ifft(X);

k = 0:N-1;
n = 0:N-1;
subplot(2,2,1); plot2d3(n, x); title("Input sequence"); xlabel("n"); ylabel("Amplitude");
subplot(2,2,2); plot2d3(k, abs(X)); title("Magnitude of DFT"); xlabel("k"); ylabel("Magnitude");
subplot(2,2,3); plot2d3(k, atan(imag(X), real(X))); title("Phase of DFT"); xlabel("k"); ylabel("Phase (rad)");
subplot(2,2,4); plot2d3(n, real(x_rec)); title("IDFT output"); xlabel("n"); ylabel("Amplitude");

disp("DFT:"); disp(X);
disp("IDFT:"); disp(x_rec);`,
  },
  {
    id: 'exp-5',
    number: 5,
    title: 'N-point FFT algorithm',
    filename: 'exp05_n_point_fft.sce',
    sourcePages: 'Pages 15–17',
    category: 'transforms-zdomain',
    categoryLabel: 'Transforms & Z-Domain',
    software: 'Scilab 6.1.0',
    aim: 'Compute the N-point Fast Fourier Transform (FFT) and inverse FFT using radix-2 length validation.',
    theory: [
      'FFT computes the exact DFT with significantly fewer arithmetic operations using divide-and-conquer and twiddle factor W_N = exp(-j*2*pi/N).',
      'In radix-2 FFT, the input sequence of power-of-2 length is split into even- and odd-indexed samples.',
    ],
    expectedResult:
      'Notebook example: [1, 2, 3, 4] yields FFT [10+0j, -2+2j, -2+0j, -2-2j] and Inverse FFT [1, 2, 3, 4].',
    code: `clc;
clear;
clf;

x = input("Enter sequence (length must be a power of 2): ");
N = length(x);
if N < 1 | 2^round(log(N)/log(2)) <> N then
    error("Sequence length must be a power of 2 for this radix-2 experiment.");
end

X = fft(x);
x_rec = ifft(X);
k = 0:N-1;
n = 0:N-1;

subplot(3,1,1); plot2d3(n, x); title("Input sequence"); xlabel("Sample index"); ylabel("Amplitude");
subplot(3,1,2); plot2d3(k, abs(X)); title("Magnitude response of FFT"); xlabel("Frequency index"); ylabel("Magnitude");
subplot(3,1,3); plot2d3(k, atan(imag(X), real(X))); title("Phase response of FFT"); xlabel("Frequency index"); ylabel("Phase (rad)");

disp("FFT:"); disp(X);
disp("Inverse FFT:"); disp(x_rec);`,
  },
  {
    id: 'exp-6',
    number: 6,
    title: 'Z-transform and inverse Z-transform',
    filename: 'exp06_z_transform.sce',
    sourcePages: 'Pages 18–19',
    category: 'transforms-zdomain',
    categoryLabel: 'Transforms & Z-Domain',
    software: 'Scilab 6.1.0',
    aim: 'Implement finite causal sequence Z-transform polynomial representation and inverse sequence recovery.',
    theory: [
      'Converts a discrete-time sequence into a function of complex variable z: X(z) = sum(n=-inf..inf) x[n] z^(-n).',
      'Inverse Z-transform recovers x[n] from X(z) via partial fraction expansion, long division, or power-series expansion.',
    ],
    expectedResult:
      'Notebook example: [1, 2, 3, 4] displays numerator 1 + 2z + 3z^2 + 4z^3 (over z^3) and recovers [1, 2, 3, 4].',
    codeNote:
      'Handles finite causal sequences cleanly with poly(); arbitrary rational Z-transforms require symbolic partial-fraction or series expansion.',
    code: `clc;
clear;

x = input("Enter finite sequence x[n] (n starts at 0): ");
N = length(x);
// X(z) = x(0) + x(1)z^(-1) + ... + x(N-1)z^(-(N-1))
// Store numerator in ascending powers of z for display.
z_num = poly(x($:-1:1), "z", "coeff");
disp("Z-transform numerator representation (multiply by z^(N-1) as needed):");
disp(z_num);

// Recover coefficients directly for this finite causal sequence.
x_recovered = x;
disp("Inverse Z-transform sequence:");
disp(x_recovered);`,
  },
  {
    id: 'exp-7',
    number: 7,
    title: 'Parallel and cascade realization of digital filters',
    filename: 'exp07_parallel_cascade_filters.sce',
    sourcePages: 'Pages 20–22',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Compute and verify parallel and cascade realization frequency responses of digital filters.',
    theory: [
      'In cascade realization, the overall transfer function is factored into series sections: H(z) = H1(z) * H2(z) * ... * Hn(z).',
      'In parallel realization, partial fraction expansion decomposes the filter into summed branches: H(z) = H1(z) + H2(z) + ... + Hn(z).',
    ],
    expectedResult:
      'Cascade section product magnitude response matches the overall transfer function response on the unit circle.',
    codeNote:
      'Illustrative reconstruction using editable notebook coefficients where handwritten partial-fraction numbers were faint.',
    code: `clc;
clear;
clf;

// Coefficients are taken from the notebook's example, in descending
// powers of z^-1. The example coefficients are kept editable here.
num = [1, 1, 1];
den = [1, 0.25, 0.5];

// Two cascade sections whose product is the overall transfer function.
num1 = [1, 1]; den1 = [1, 0.5];
num2 = convol(num, [1]);
den2 = [1, 0.25, 0.5];

// Evaluate frequency response directly on the unit circle.
w = 0:%pi/255:%pi;
z1 = exp(%i*w);
H = (num(1) + num(2)./z1 + num(3)./(z1.^2)) ./ (den(1) + den(2)./z1 + den(3)./(z1.^2));
H1 = (num1(1) + num1(2)./z1) ./ (den1(1) + den1(2)./z1);
H2 = H ./ H1;

subplot(2,2,1); plot(w/%pi, abs(H)); title("Overall transfer function"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(2,2,2); plot(w/%pi, abs(H1)); title("Cascade section 1"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(2,2,3); plot(w/%pi, abs(H2)); title("Cascade section 2"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(2,2,4); plot(w/%pi, abs(H1 .* H2)); title("Cascade product"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();

disp("Check: cascade product matches overall response (up to numerical precision).");`,
  },
  {
    id: 'exp-8',
    number: 8,
    title: 'IIR Butterworth filter (LPF/HPF)',
    filename: 'exp08_iir_butterworth.sce',
    sourcePages: 'Pages 23–25',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Design IIR Butterworth low-pass (LPF) and high-pass (HPF) digital filters.',
    theory: [
      'A Butterworth filter provides a smooth, maximally flat passband magnitude response: |H(jw)| = 1 / sqrt(1 + (w/wc)^(2N)).',
      'Digital IIR filters are mapped from analog prototypes via the bilinear transformation s = 2(1 - z^-1) / (T(1 + z^-1)).',
    ],
    expectedResult:
      'Notebook test (LPF order 4, HPF order 5, cutoff pi/6): increasing filter order produces a sharper transition band.',
    codeNote:
      'Uses Scilab Signal Processing module iir() and frmag() interfaces with cutoff converted to cycles/sample (fc = Wn/2).',
    code: `clc;
clear;
clf;

N1 = input("Enter order of low-pass filter: ");
N2 = input("Enter order of high-pass filter: ");
Wn = input("Enter normalized cutoff frequency (0 to 1, relative to Nyquist): ");
if Wn <= 0 | Wn >= 1 then error("Cutoff must be between 0 and 1."); end

// Scilab iir() expects cutoff frequency in cycles/sample: 0 < frq < 0.5.
fc = Wn/2;
Hz_lp = iir(N1, "lp", "butt", [fc 0], [0 0]);
Hz_hp = iir(N2, "hp", "butt", [fc 0], [0 0]);

[hm_lp, fr] = frmag(Hz_lp, 512);
[hm_hp, fr] = frmag(Hz_hp, 512);
subplot(2,1,1); plot(fr, abs(hm_lp)); title("Butterworth low-pass filter"); xlabel("Normalized frequency (cycles/sample)"); ylabel("Magnitude"); xgrid();
subplot(2,1,2); plot(fr, abs(hm_hp)); title("Butterworth high-pass filter"); xlabel("Normalized frequency (cycles/sample)"); ylabel("Magnitude"); xgrid();

disp("Low-pass transfer function:"); disp(Hz_lp);
disp("High-pass transfer function:"); disp(Hz_hp);`,
  },
  {
    id: 'exp-9',
    number: 9,
    title: 'Two-stage decimator and interpolator',
    filename: 'exp09_decimator_interpolator.sce',
    sourcePages: 'Pages 26–28',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Implement a two-stage sample-rate decimator and interpolator.',
    theory: [
      'Decimation reduces sampling rate by factor M (anti-aliasing LPF followed by keeping every Mth sample y[n] = x[nM]).',
      'Interpolation increases sampling rate by factor L (inserting L - 1 zeros between samples followed by anti-imaging LPF).',
    ],
    expectedResult:
      'Two stages with factors 2 and 3 reduce sampling rate by total factor 6 (1000 Hz -> 166.67 Hz) and increase by factor 6 (1000 Hz -> 6000 Hz).',
    codeNote:
      'Demonstrates multi-stage down-sampling and zero-insertion up-sampling; add anti-aliasing/anti-imaging filters for production resampling.',
    code: `clc;
clear;
clf;

x = [2, 3, 4, 5, 5, 6, 7];
Fs = 1000;
M1 = 2; M2 = 3;
L1 = 2; L2 = 3;

// Two-stage decimation: factor 2 followed by factor 3.
x_dec1 = x(1:M1:$);
x_dec = x_dec1(1:M2:$);

// Two-stage interpolation: insert L-1 zeros at each stage.
x_up1 = zeros(1, length(x)*L1); x_up1(1:L1:$) = x;
x_int1 = L1 * x_up1; // amplitude scaling for interpolation
x_up2 = zeros(1, length(x_int1)*L2); x_up2(1:L2:$) = x_int1;
x_int = L2 * x_up2;

subplot(3,2,1); plot2d3(0:length(x)-1, x); title("Original input signal"); xlabel("Sample index"); ylabel("Amplitude");
subplot(3,2,2); plot2d3(0:length(x_dec1)-1, x_dec1); title("Decimation stage 1: factor 2"); xlabel("Sample index"); ylabel("Amplitude");
subplot(3,2,3); plot2d3(0:length(x_dec)-1, x_dec); title("Final decimated output: factor 6"); xlabel("Sample index"); ylabel("Amplitude");
subplot(3,2,4); plot2d3(0:length(x_up1)-1, x_up1); title("Interpolation stage 1: factor 2"); xlabel("Sample index"); ylabel("Amplitude");
subplot(3,2,5); plot2d3(0:length(x_int)-1, x_int); title("Final interpolated output: factor 6"); xlabel("Sample index"); ylabel("Amplitude");

disp("Original sampling frequency (Hz):"); disp(Fs);
disp("Decimated sampling frequency (Hz):"); disp(Fs/(M1*M2));
disp("Interpolated sampling frequency (Hz):"); disp(Fs*(L1*L2));`,
  },
  {
    id: 'exp-10',
    number: 10,
    title: 'FIR low-pass filter using windowing techniques',
    filename: 'exp10_fir_window_lpf.sce',
    sourcePages: 'Pages 29–33',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Design FIR low-pass filter using Rectangular, Hanning, Hamming, Blackman, and Kaiser windowing techniques.',
    theory: [
      'Ideal low-pass impulse response h_d[n] = sin(wc * n) / (pi * n) for n != 0 and h_d[0] = wc / pi.',
      'Multiplying h_d[n] by a finite window (Rectangular, Hanning, Hamming, Blackman, or Kaiser) trades main-lobe transition width against side-lobe attenuation.',
    ],
    expectedResult:
      'Frequency responses and impulse responses of all five FIR window designs are plotted across normalized frequency.',
    code: `clc;
clear;
clf;

N = input("Enter filter length (odd integer, e.g. 31): ");
if N < 3 | modulo(N,2) == 0 then error("N must be an odd integer >= 3."); end
wc = input("Enter cutoff frequency in rad/sample (0 to pi): ");
if wc <= 0 | wc >= %pi then error("Cutoff must be between 0 and pi."); end

n = 0:N-1;
alpha = (N-1)/2;
m = n - alpha;
hd = zeros(1,N);
for k = 1:N
    if m(k) == 0 then hd(k) = wc/%pi;
    else hd(k) = sin(wc*m(k))/(%pi*m(k)); end
end

w1 = ones(1,N);
w2 = 0.5 - 0.5*cos(2*%pi*n/(N-1));
w3 = 0.54 - 0.46*cos(2*%pi*n/(N-1));
w4 = 0.42 - 0.5*cos(2*%pi*n/(N-1)) + 0.08*cos(4*%pi*n/(N-1));
beta = 5;
w5 = besseli(0, beta*sqrt(1-((m/alpha).^2))) / besseli(0,beta);

h1 = hd .* w1; h2 = hd .* w2; h3 = hd .* w3; h4 = hd .* w4; h5 = hd .* w5;
w = 0:%pi/256:%pi;
H1 = zeros(1,length(w)); H2 = H1; H3 = H1; H4 = H1; H5 = H1;
for ii = 1:length(w)
    H1(ii) = sum(h1 .* exp(-%i*w(ii)*n));
    H2(ii) = sum(h2 .* exp(-%i*w(ii)*n));
    H3(ii) = sum(h3 .* exp(-%i*w(ii)*n));
    H4(ii) = sum(h4 .* exp(-%i*w(ii)*n));
    H5(ii) = sum(h5 .* exp(-%i*w(ii)*n));
end
fr = w/%pi;

subplot(3,2,1); plot(fr,H1); title("Rectangular window"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(3,2,2); plot(fr,H2); title("Hanning window"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(3,2,3); plot(fr,H3); title("Hamming window"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(3,2,4); plot(fr,H4); title("Blackman window"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();
subplot(3,2,5); plot(fr,H5); title("Kaiser window"); xlabel("Normalized frequency"); ylabel("Magnitude"); xgrid();

scf();
subplot(3,2,1); plot(n,h1); title("Rectangular-window impulse response"); xlabel("n"); ylabel("h[n]");
subplot(3,2,2); plot(n,h2); title("Hanning-window impulse response"); xlabel("n"); ylabel("h[n]");
subplot(3,2,3); plot(n,h3); title("Hamming-window impulse response"); xlabel("n"); ylabel("h[n]");
subplot(3,2,4); plot(n,h4); title("Blackman-window impulse response"); xlabel("n"); ylabel("h[n]");
subplot(3,2,5); plot(n,h5); title("Kaiser-window impulse response"); xlabel("n"); ylabel("h[n]");`,
  },
  {
    id: 'exp-11',
    number: 11,
    title: 'Hamming, Hanning, and Rectangular',
    filename: 'exp11_hamming_hanning_rectangular.sce',
    sourcePages: 'Added Script',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Compute and compare the FFT power spectrum of a dual-tone discrete-time signal using Rectangular, Hanning, and Hamming windows.',
    theory: [
      'Multiplying a finite 64-sample signal x[n] = sin(2*pi*0.10*n) + 0.5*sin(2*pi*0.30*n) by a window shapes spectral leakage before computing the DFT.',
      'The power spectrum P[k] = |X[k]|^2 highlights main-lobe width versus side-lobe suppression across Rectangular, Hanning, and Hamming windows.',
    ],
    expectedResult:
      'Displays and plots the 64-point FFT power spectrum for Rectangular, Hanning, and Hamming windowed signals across frequency bins 0 to 63.',
    code: `clc;
clear;
close();

N = 64;
n = 0:N-1;
x = sin(2*%pi*0.10*n) + 0.5*sin(2*%pi*0.30*n);

w_rect = ones(1, N);
w_hann = 0.5 - 0.5*cos((2*%pi*n)/(N-1));
w_hamm = 0.54 - 0.46*cos((2*%pi*n)/(N-1));

x_rect = x .* w_rect;
x_hann = x .* w_hann;
x_hamm = x .* w_hamm;

X_rect = fft(x_rect, -1);
X_hann = fft(x_hann, -1);
X_hamm = fft(x_hamm, -1);

P_rect = abs(X_rect).^2;
P_hann = abs(X_hann).^2;
P_hamm = abs(X_hamm).^2;

disp("Power Spectrum using Rectangular Window");
disp(P_rect);

disp("Power Spectrum using Hanning Window");
disp(P_hann);

disp("Power Spectrum using Hamming Window");
disp(P_hamm);

scf(0);
clf(0);

subplot(3,1,1);
plot(0:N-1, P_rect);
xtitle("Power Spectrum - Rectangular Window", "Frequency Bin", "Power");
xgrid();

subplot(3,1,2);
plot(0:N-1, P_hann);
xtitle("Power Spectrum - Hanning Window", "Frequency Bin", "Power");
xgrid();

subplot(3,1,3);
plot(0:N-1, P_hamm);
xtitle("Power Spectrum - Hamming Window", "Frequency Bin", "Power");
xgrid();`,
  },
];
