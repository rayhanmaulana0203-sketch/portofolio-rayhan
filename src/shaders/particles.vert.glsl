uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vPosition;
varying float vScale;

void main() {
    vPosition = position;
    vScale = aScale;

    vec3 transformed = position;
    transformed.x += sin(uTime * 0.35 + aRandomness.x * 6.2831) * 0.12;
    transformed.y += cos(uTime * 0.25 + aRandomness.y * 6.2831) * 0.12;
    transformed.z += sin(uTime * 0.30 + aRandomness.z * 6.2831) * 0.12;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * aScale * uPixelRatio * (28.0 / -mvPosition.z);
}
