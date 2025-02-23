import satori from 'satori';
import { html } from 'satori-html';
import type { SvgConfig } from '../types';
import { DEFAULT_FONTS } from '../config';

export async function generateSiteOgSvg(svgConfig: SvgConfig) {
  const markup = html(`
<div
  style="position: relative; width: 1200px; height: 630px; display: flex; justify-content: space-between; background: #f9f9f5; padding: 40px; font-family: Arial, sans-serif;"
>
  <div
    style="position: absolute; top: 40px; left: 40px; display: flex; flex-direction: column; gap: 8px;"
  >
    <div style="display: flex; gap: 10px;">
      <span style="width: 28px;">
        <svg
          style="border-radius: 4px;"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M0 0v24h24v-24h-24zm16 7h-1.923c-.616 0-1.077.252-1.077.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"
          ></path>
        </svg>
      </span>
      <span style="width: 28px;">
        <svg
          style="border-radius: 4px;"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z"
          ></path>
        </svg>
      </span>
      <span style="width: 28px;">
        <svg
          style="border-radius: 4px;"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M0 0v24h24v-24h-24zm14.534 19.59c-.406.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.311-1.588-.824-2.147.083-.202.357-1.016-.079-2.117 0 0-.671-.215-2.198.82-.639-.18-1.323-.267-2.003-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z"
          ></path>
        </svg>
      </span>
    </div>
    <span style="font-size: 18px;">@truedaniyyel</span>
  </div>

  <div
    style="max-width: 45%; display: flex; flex-direction: column; justify-content: center;"
  >
    <div style="display: flex; flex-direction: column;">
      <h1 style="font-size: 54px; font-weight: 900; line-height: 1.4;">
        Helping You Make Sense of Things
      </h1>

      <div style="display: flex; align-items: center; margin-top: 16px;">
        <div
          style="display: flex; border-radius: 50%; border: 3px solid #000; margin-right: 10px; overflow: hidden;"
        >
          <img
            src="https://github.com/truedaniyyel.png"
            alt="Author"
						width="64" 
						height="64"
            style="width: 64px; height: 64px; border-radius: 50%; padding: 2px;"
          />
        </div>
        <p style="margin: 0; font-weight: 400; font-size: 24px;">
          Daniel Adrian
        </p>
      </div>
    </div>
  </div>
  <div style="display: flex; align-items: center;">
		<img width="608" height="312" src="https://raw.githubusercontent.com/truedaniyyel/daniel-adrian-blog/refs/heads/main/public/og-mic.png" alt="Mic" />
	</div>
</div>
`);

  return await satori(markup, {
    ...svgConfig,
    fonts: DEFAULT_FONTS,
  });
}
