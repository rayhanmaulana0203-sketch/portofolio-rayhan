precision mediump float;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vPosition;
varying float vScale;

void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float star = step(distanceToCenter, 0.5);
    float brightness = mix(0.4, 0.8, vScale);
    float colorMix = clamp((vPosition.y + 3.0) / 6.0, 0.0, 1.0);
    vec3 finalColor = mix(uColorA, uColorB, colorMix);

    gl_FragColor = vec4(finalColor, star * brightness);
}
