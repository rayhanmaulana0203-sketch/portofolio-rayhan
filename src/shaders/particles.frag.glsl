precision mediump float;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vPosition;
varying float vScale;

void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) {
        discard;
    }

    // Quadratic radial intensity falloff for glowing star particles
    float glow = 1.0 - (distanceToCenter * 2.0);
    glow = pow(glow, 2.0);

    // Subtle interpolation between lime brand color and cyan
    float colorMix = clamp((vPosition.y + 3.0) / 6.0, 0.0, 1.0);
    vec3 finalColor = mix(uColorA, uColorB, colorMix);

    gl_FragColor = vec4(finalColor, glow * 0.85);
}
