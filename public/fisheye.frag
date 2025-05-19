precision mediump float;
uniform sampler2D tex0;
uniform vec2 resolution;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord * 2.0 - 1.0;
  float r = length(uv);
  if (r > 1.0) discard;
  uv *= 1.0 - r * 0.5;
  vec2 corrected = (uv + 1.0) / 2.0;
  gl_FragColor = texture2D(tex0, corrected);
}
