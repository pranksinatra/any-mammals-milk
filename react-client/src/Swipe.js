import React from 'react';
import styled from '@emotion/styled';
import Swing from 'react-swing';

const ContainerBox = styled('div')`
  position: relative;
  width: 520px;
  max-width: 100%;
  margin: 2rem auto 8rem;
  outline: 2px solid red;
  :before {
    content: '';
    display: block;
    padding-bottom: 80%; /* 10x8, so not perfectly square */
  }
`;

const CenterContents = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  &.topmost {
    z-index: 1;
    filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
  }
  .blur {
    filter: blur(5px);
  }

  .image {
    /* max-width set programmatically */
    position: relative;
    flex-grow: 1;
    background-size: contain;
  }

  .caption {
    position: absolute;
    width: 100%;
    text-align: center;
    background-color: #f5f5f5;
    padding: 0.5rem 0;
  }
`;

const CircleButton = styled('button')`
  position: absolute;
  top: 50%;
  z-index: 2;

  font-size: 16px;
  height: 3em;
  width: 3em;
  border-radius: 50%;

  @media (min-width: 400px) {
    font-size: 20px;
  }
`;

const YesButton = styled(CircleButton)`
  right: 1rem;
  background-color: rgb(40, 167, 69);
  :hover {
    background-color: rgb(33, 136, 56);
  }
  :focus {
    box-shadow: 0 0 0 0.2em rgba(33, 167, 69, 0.5);
  }
`;

const NoButton = styled(CircleButton)`
  left: 1rem;
  background-color: rgb(220, 53, 69);
  :hover {
    background-color: rgb(200, 35, 51);
  }
  :focus {
    box-shadow: 0 0 0 0.2em rgba(220, 53, 69, 0.5);
  }
`;

// Helpers
const getMammalBoxId = ({ id }) =>
  id
    .replace(' ', '-')
    .toLowerCase()
    .replace(/[^a-z-]/g, '');

const getMammalBoxMaxWidth = ({ width, height }) => {
  const aspectRatio = width / height,
    boxRatio = 10 / 8;

  return 100 * (aspectRatio > boxRatio ? 1 : width / height / boxRatio) + '%';
};

const swingConfig = {
  allowedDirections: [Swing.DIRECTION.LEFT, Swing.DIRECTION.RIGHT],
  throwOutDistance: () => Math.max(window.windowWidth) / 4 + 200,

  // Make it easier to swipe left or right on a card
  throwOutConfidence: (xOffset, yOffset, element) => {
    const cardWidth = element.offsetWidth,
      cardHeight = element.offsetHeight;

    // Card's container side length.
    // Average it with card width to make cards behave more similarly regardless of width
    const squareWidth = Math.max(cardHeight, cardWidth);

    const xConfidence = Math.min(
      Math.abs(xOffset) / ((cardWidth + squareWidth) / 3.6),
      1
    );
    const yConfidence = Math.min(Math.abs(yOffset) / cardHeight, 1);

    return Math.max(xConfidence, yConfidence);
  },
};

class Swipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  // Only render if we're not using SSR
  componentDidMount() {
    this.setState({
      mounted: true,
    });
  }

  render() {
    const testProps = {
      mammals: [
        {
          id: 'Pseudoryx nghetinhensis',
          name: 'Saola',
          image: '/mammals/640px-Pseudoryx_nghetinhensis.PNG',
          notes:
            'No individuals in captivity. Wild population highly dispersed, and subpopulations fragmented with numbers of mature individuals below the minimum viable population. Foremost threatened by hunting.',
          population: '< 750',
          status: 'CR',
          trend: 'decrease',
          width: 640,
          height: 449,
        },
        {
          id: 'Porcula salvania',
          name: 'Pygmy hog',
          image: '/mammals/640px-PorculaSalvaniaAdultWolf.jpg',
          notes: 'Maximum estimate for mature individuals.',
          population: '250',
          status: 'CR',
          trend: 'decrease',
          width: 640,
          height: 458,
        },
      ],
    };

    const mammals = testProps.mammals;

    if (mammals && this.state.mounted) {
      return (
        <ContainerBox>
          <Swing
            config={swingConfig}
            setStack={stack => console.log('updated stack', stack)}
          >
            {mammals.map((mammal, index) => {
              const id = getMammalBoxId(mammal);
              const maxWidth = getMammalBoxMaxWidth(mammal);
              const paddingBottom = (100 / mammal.width) * mammal.height + '%';

              return (
                <CenterContents
                  className={index === mammals.length - 1 ? 'topmost' : ''}
                >
                  <div
                    key={id}
                    id={id}
                    className={index === 0 ? 'image blur' : 'image'}
                    style={{
                      backgroundImage: `url(${mammal.image})`,
                      maxWidth,
                    }}
                  >
                    <div style={{ paddingBottom }} />
                    <div className="caption">{mammal.name}</div>
                  </div>
                </CenterContents>
              );
            })}
          </Swing>
          <YesButton className={'title-font'}>Yes</YesButton>
          <NoButton className={'title-font'}>No</NoButton>
        </ContainerBox>
      );
    }

    // Loading message
    return (
      <ContainerBox>
        <CenterContents>
          <div style={{ color: '#666' }}>Loading...</div>
        </CenterContents>
      </ContainerBox>
    );
  }
}

export default Swipe;
