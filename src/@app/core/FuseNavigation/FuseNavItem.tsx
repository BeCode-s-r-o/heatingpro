const components: { [key: string]: any } = {};

export function registerComponent(name: string, Component: React.FC) {
  components[name] = Component;
}

export default function FuseNavItem(props: any) {
  const C = components[props.type];
  return C ? <C {...props} /> : null;
}
