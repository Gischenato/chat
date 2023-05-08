import styled, { DefaultTheme } from 'styled-components'

interface TitleTextProps {
  size? : 'xl' | 'l' | 'm' | 's' | 'xs'
  color?: keyof DefaultTheme['colors']
}

interface RegularTextProps {
  size? : 'l' | 'm' | 's'
  color?: keyof DefaultTheme['colors']
  bold?: boolean
}

export const TitleText = styled.h1<TitleTextProps>`
  font-family: ${({ theme }) => `${theme.fonts.title}, sans-serif`};
  font-size: ${({ theme, size }) => theme.fontSizes[`title-${size ? size : 'l'}`]};
  font-weight: ${({ size }) => {
    if (size === 's' || size === 'xs') return 800
    return 700
  }};
  color: ${({ theme, color }) => theme.colors[color || 'base-title']};
`

export const RegularText = styled.p<RegularTextProps>`
  font-family: ${({ theme }) => `${theme.fonts.text}, sans-serif`};
  font-size: ${({ theme, size }) => theme.fontSizes[`text-${size ? size : 'm'}`]};
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
  color: ${({ theme, color }) => theme.colors[color || 'base-text']};
`