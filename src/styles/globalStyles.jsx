import styled from 'styled-components';
import { TEXT_SECUNDARY, WHITE, BOX_SHADOW, BACKGROUND, HR } from './Colors';


export const GenericP = styled.p`
  /* color: ${ TEXT_SECUNDARY }; */
  margin: 0;
  /* margin-top: 0.5em; */
  margin-bottom: 0.5em;
`;


const MARGIN = '0.5em';

export const Input = styled.input`
  background-color: ${WHITE};
  border: solid #CDD7E1 .1px !important;
  border-radius: 5px;
  font-size: 1em;
  padding: 0.5m;
  line-height: .5em;
  box-shadow: ${BOX_SHADOW};
  outline: none;
     &:disabled {
    background-color: #F8F8FF; 
    color: black;  
  }
  &:focus, &:active {
  background-color: ${({ $styled }) => !$styled && WHITE};
  box-shadow: ${({ $styled }) =>
    !$styled && '0 0 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(0, 0, 0, 0.10)'};
  border-color: ${({ $styled }) => !$styled && '#ddd'};
  }
    
`;

export const selectInput = styled.input`
  background-color: ${WHITE};
  border: solid #CDD7E1 .1px;
  border-radius: 5px;
  /* margin: ${MARGIN} 0; */
  /* font-size: 0.7em; */
  padding: 1em;
  box-shadow: ${BOX_SHADOW};
  outline: none;
`;

export const InputLine = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${({ column }) => column ? 'column' : 'row'};
  align-items: flex-start;
`

export const SmallInputLine = styled(InputLine)`
  margin-right: 1rem;
  max-width: calc(37.5% - 1rem);
`

export const MediumInputLine = styled(InputLine)`
  margin-right: 1rem;
  max-width: calc(50% - 1rem);
`

export const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  margin-left: ${({ first, small }) => first ? 0 : small ? '.5rem' : '1rem'};
  margin-right: ${({ first, small }) => first && small ? '.5rem' : '0'};
  margin-right: ${({ first, medium }) => first && medium ? '.3rem' : '0'};
  width: ${({ small }) => small ? '30%' : '20%'};
  width: ${({ medium }) => medium ? '8%' : '20%'};
  width: ${({ first, medium }) => first && medium ? '7%' : 'auto'};
  
  flex-grow: ${({ imgW, small }) => imgW || small ? 0 : 1};
  /* color: ${TEXT_SECUNDARY}; */

  /* @media(min-width: 1280px) {
    margin-left: ${({ gap }) => gap ? '1rem' : '0'};
    width: ${({ items }) => !items || items < 2 ? '100%' : `calc(100% / ${items})`};
    max-width: ${({ maxWidth }) => maxWidth && maxWidth};
    padding: ${({ pad, maxWidth }) => pad && `0 calc((100% - ${maxWidth}) / 2)`};
  } */
     &:disabled {
    background-color: #F8F8FF; 
    color: black;  
  }
    
`;

export const LookupLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  margin-left: ${({ first, small }) => first ? 0 : small ? '.5rem' : '1rem'};
  margin-right: ${({ first, small }) => first && small ? '.5rem' : '0'};
  width: ${({ small }) => small ? '40%' : 'auto'};
  

`;


export const StyledSelect = styled.select`
  color: black; 
  box-shadow: ${BOX_SHADOW};
  background-color: ${WHITE};
  border: solid #CDD7E1 .1px !important;
  border-radius: 5px;
  margin: ${MARGIN} 1; 
  font-size: 1em;
  padding: 0.75em;
  box-shadow: ${BOX_SHADOW};
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  cursor: pointer;
  width: 100%;
  text-align: left; 
  line-height: 2rem;
  font-size: 1rem;
  padding: 0.5rem 0;
  height: 100%;
  overflow-y: scroll;

  &:disabled {
  background-color: #F8F8FF;
  color: black;  
  }

  &:focus, &:active {
  background-color: ${({ $styled }) => !$styled && WHITE};
  box-shadow: ${({ $styled }) =>
    !$styled && '0 0 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(0, 0, 0, 0.10)'};
  border-color: ${({ $styled }) => !$styled && '#ddd'};
  }


  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

export const InputDate = styled.input`
  border: solid #CDD7E1 .1px;
  border-radius: 5px;
  font-size: 1em;
  padding: 0.5em;
  box-shadow: ${BOX_SHADOW};
  outline: none;
    &:disabled {
  background-color: #F8F8FF;
  color: black;  
  }
    &:focus, &:active {
  background-color: ${({ $styled }) => !$styled && WHITE};
  box-shadow: ${({ $styled }) =>
    !$styled && '0 0 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(0, 0, 0, 0.10)'};
  border-color: ${({ $styled }) => !$styled && '#ddd'};
  }

  
`

export const InputMoney = styled.input`
  background-color: ${WHITE};
  border: solid #CDD7E1 .1px;
  border-radius: 5px;
  font-size: 1em;
  padding: 0.5em;
  box-shadow: ${BOX_SHADOW};
  outline: none;
    &:disabled {
  background-color: #F8F8FF;
  color: black; 
}
      &:focus, &:active {
  background-color: ${({ $styled }) => !$styled && WHITE};
  box-shadow: ${({ $styled }) =>
    !$styled && '0 0 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(0, 0, 0, 0.10)'};
  border-color: ${({ $styled }) => !$styled && '#ddd'};
  
`

export const InputWrapper = styled.div`
  display: flex;
  width: 100%; 
  gap: 10px; 
  margin-bottom: 15px; 
`;

export const SelectedItem = styled.span`
  margin: 5px;
  display: inline-flex;
  align-items: center;
  background: #eee;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
  max-width: 100%;
  white-space: nowrap;  /* Garante que o texto não seja quebrado */
  overflow: hidden;     /* Evita estouro de conteúdo */
  text-overflow: ellipsis; /* Adiciona "..." se o texto for muito longo */
`;

export const RemoveButton = styled.button`
  background: none;
  color: black;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  display: inline-block;
  padding: 0;
  line-height: 1;
`;

export const LookupButton = styled.button`
  width: 10%;
  height: 100%;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 0px;
  display: flex;
  padding: 0;
  &:hover {
    color: inherit;
  }

  &:focus {
    outline: none; 
  }
`;
