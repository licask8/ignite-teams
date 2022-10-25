import { Container, Logo, BackIcon, BackButton } from "./styles";
import logoImage from '@assets/logo.png';

type Props = {
 showBackButton?: boolean;
}

export function Header({ showBackButton = false}: Props) {
    return (
        <Container>

            { 
            showBackButton && 
            <BackButton>
                 <BackIcon />
            </BackButton>}

            <Logo source={logoImage} />
        </Container>
    );
}