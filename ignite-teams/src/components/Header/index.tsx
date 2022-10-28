import { Container, Logo, BackIcon, BackButton } from "./styles";
import logoImage from '@assets/logo.png';
import { useNavigation} from '@react-navigation/native'

type Props = {
 showBackButton?: boolean;
}

export function Header({ showBackButton = false}: Props) {

    const navigate = useNavigation();

    function handleGoBack() {
      navigate.navigate('groups');
    }

    return (
        <Container>

            { 
            showBackButton && 
            <BackButton
            onPress={handleGoBack}
            >
                 <BackIcon  />
            </BackButton>}

            <Logo source={logoImage} />
        </Container>
    );
}