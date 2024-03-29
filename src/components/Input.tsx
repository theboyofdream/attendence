import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS, FONTSIZE, ROUNDNESS, SPACING } from '~src/utils';

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
            // backgroundColor: '#00000015',
            borderRadius: ROUNDNESS.md,
            color: COLORS[props.errorText ? 'dangerText' : 'text'],
            padding: SPACING.md,
            paddingLeft: SPACING.lg,
            fontSize: FONTSIZE.sm
          },
          props.style
        ]}
        cursorColor={COLORS[props.errorText ? 'dangerText' : 'text']}
        placeholderTextColor={
          props.placeholderTextColor ?? COLORS.textTertiary
        }
      />

      {props.errorText && <Text style={{ marginHorizontal: SPACING.xs, color: COLORS.dangerText }} children={props.errorText} />}
    </View>
  );
};
