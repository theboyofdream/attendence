import { Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS, ROUNDNESS, SPACING } from '~src/theme';

export type InputProps = TextInputProps & {
  label?: string;
  errorText?: string;
};

export const Input = (props: InputProps) => {
  return (
    <View style={{ gap: SPACING.sm }}>
      <Text style={{
        marginHorizontal: SPACING.xs,
        color: COLORS[props.errorText ? 'dangerText' : 'text']
      }}>
        {props.label ?? props.placeholder}
      </Text>

      <TextInput
        maxLength={props.multiline ? undefined : 100}
        {...props}
        style={[
          {
            backgroundColor: COLORS[props.errorText ? 'dangerBackground' : 'backgroundSecondary'],
            color: COLORS[props.errorText ? 'dangerText' : 'text'],
            borderRadius: ROUNDNESS.sm, padding: SPACING.lg,
          },
          props.style
        ]}
        cursorColor={COLORS[props.errorText ? 'dangerText' : 'infoText']}
        placeholderTextColor={
          props.placeholderTextColor ?? COLORS.textTertiary
        }
      />

      {props.errorText && <Text style={{ marginHorizontal: SPACING.xs, color: COLORS.dangerText }} children={props.errorText} />}
    </View>
  );
};
