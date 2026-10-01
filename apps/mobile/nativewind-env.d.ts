/// <reference types="nativewind/types" />

// NativeWind nests its own react-native/@types/react inside its node_modules
// in this workspace (a version-conflict artifact of npm hoisting), so its
// own `declare module "react-native"` augmentation doesn't merge onto the
// top-level react-native types our app actually imports. Mirror the
// `className` additions here directly so components keep real type checking.
import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface PressableStateCallbackType {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface ImageProps {
    className?: string;
  }
}
