import React from 'react';
import styled from '@emotion/styled';
import { titleFont } from './lib/fonts';

// Aspect ratio of the box that contains the mammal figure (image)
// and the caption below it. The figure is perfectly centered in
// this 10x8 box.
const containerAspectRatio = 10 / 8;

const ContainerBox = styled('div')`
  position: relative;
  width: 520px;
  max-width: 100%;
  margin: 2rem auto 4rem;
  ${'' /* outline: 2px solid red; */}
  :before {
    content: '';
    display: block;
    padding-bottom: ${100 / containerAspectRatio}%;
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
`;

const Mammal = styled('figure')`
  /* max-width set programmatically */
  position: relative;
  flex-grow: 1;
  background-size: 101% auto;
  background-repeat: no-repeat;
  background-color: #e7e7e7;
`;

const Caption = styled('figcaption')`
  position: absolute;
  width: 100%;
  text-align: center;
  background-color: #f5f5f5;
  padding: 0.5rem 0;
  margin: 0;
`;

const CircleButton = styled('button')`
  position: absolute;
  top: calc(50% - 1.5rem + 20px);
  z-index: 4;
  font-family: ${titleFont};

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
const getMammalBoxMaxWidth = ({ width, height }) => {
  const imageAspectRatio = width / height;

  return imageAspectRatio > containerAspectRatio
    ? '100%'
    : `${(100 * imageAspectRatio) / containerAspectRatio}%`;
};

/**
 * Generate configuration for Swing library
 * @param {Object} Swing instance
 */
const getSwingConfig = Swing => ({
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
});

/**
 * Animate a card to the right or left when user clicks Yes or No
 */
function animateCard(cardElem, isRight, callback) {
  const sign = isRight ? 1 : -1;
  const duration = 0.3;

  Object.assign(cardElem.style, {
    transition: `all ${duration}s ease-out`,
    opacity: '0',
    transformOrigin: 'transform-origin: 50% 90%',
    transform: `rotate(40deg) translateY(${-800 * sign}px) translateX(${200 *
      sign}px)`,
  });

  setTimeout(() => {
    requestAnimationFrame(callback);
  }, duration * 1000);
}

class Swipe extends React.Component {
  swingComponent = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      hasMounted: false,
    };
    this.getTopCardElement = this.getTopCardElement.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
    this.cardStack = null;
    this.amount = 3;
    this.topMammal = undefined;
    this.isAnimating = false;
  }

  // Only render if we're not using SSR
  componentDidMount() {
    this.Swing = require('react-swing').default;
    this.setState({
      hasMounted: true,
    });
  }

  getTopCardElement() {
    const cards =
      (this.swingComponent.current &&
        this.swingComponent.current.childElements) ||
      [];

    const topCard = cards.length ? cards[0].current : undefined;

    return topCard;
  }

  teardownCard(cardElement) {
    if (cardElement) this.cardStack.getCard(cardElement).destroy();
  }

  onClickButton(isYes) {
    // Ignore clicks while animation is underway
    if (this.isAnimating) return;

    const vote = () => this.props.onVote(this.topMammal, isYes);
    const topCard = this.getTopCardElement();

    // Animate card
    if (topCard) {
      this.teardownCard(topCard);
      this.isAnimating = true;
      animateCard(topCard, isYes, () => {
        this.isAnimating = false;
        vote();
      });
    } else {
      vote();
    }
  }

  onSwipe(isRight) {
    // Remove event listeners from topmost card
    this.teardownCard(this.getTopCardElement());
    this.props.onVote(this.topMammal, isRight);
  }

  render() {
    const mammals = this.props.mammals;

    if (mammals.length && this.state.hasMounted) {
      const Swing = this.Swing;
      const topMammal = mammals[0];
      this.topMammal = topMammal;

      const disableWhenAnimating = {
        pointerEvents: this.isAnimating ? 'none' : '',
      };

      // console.log('rendered top mammal', topMammal);
      return (
        <ContainerBox style={disableWhenAnimating}>
          <Swing
            config={getSwingConfig(Swing)}
            setStack={stack => (this.cardStack = stack)}
            throwoutright={() => this.onSwipe(true)}
            throwoutleft={() => this.onSwipe(false)}
            ref={this.swingComponent}
          >
            {mammals.map((mammal, index, total) => {
              const { id, name, image } = mammal;
              const maxWidth = getMammalBoxMaxWidth(image);
              const paddingBottom = (100 / image.width) * image.height + '%';

              return (
                <CenterContents
                  key={id}
                  id={id}
                  style={{ zIndex: mammals.length - index }}
                >
                  <Mammal
                    style={{
                      backgroundImage: `url(/mammals/${image.src})`,
                      maxWidth,
                      filter: mammal === topMammal ? '' : 'blur(5px)',
                    }}
                  >
                    <div style={{ paddingBottom }} />
                    <Caption
                      style={{
                        color: mammal === topMammal ? '' : 'transparent',
                      }}
                    >
                      {name}
                    </Caption>
                  </Mammal>
                </CenterContents>
              );
            })}
          </Swing>
          <YesButton onClick={() => this.onClickButton(true)}>Yes</YesButton>
          <NoButton onClick={() => this.onClickButton(false)}>No</NoButton>
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
