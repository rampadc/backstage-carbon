import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import {
  Header, HeaderContainer, SkipToContent, HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar, HeaderGlobalAction, SideNav, SideNavItems, SideNavLink,
  SideNavDivider,
  Content,
} from '@carbon/react';

import { Search, Catalog, IntentRequestCreate, Radar } from '@carbon/icons-react';


export const Root = ({ children }: PropsWithChildren<{}>) => (
  <HeaderContainer render={({ isSideNavExpanded, onClickSideNavExpand }) => (<>
    <Header aria-label="IBM Platform Name">
      <SkipToContent />
      <HeaderMenuButton aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'} onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded} />
      <HeaderName href="#" prefix="Backstage">
        with IBM Carbon Design System
      </HeaderName>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Search" onClick={() => { alert('search clicked'); }}>
          <Search size={20} />
        </HeaderGlobalAction>
        {/* <HeaderGlobalAction aria-label="Notifications" onClick={() => { console.log('notification clicked'); }}>
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="App Switcher" onClick={() => { console.log('app switcher clicked'); }} tooltipAlignment="end">
          <SwitcherIcon size={20} />
        </HeaderGlobalAction> */}
      </HeaderGlobalBar>
    </Header>
    <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onSideNavBlur={onClickSideNavExpand} isRail>
      <SideNavItems>
        <SideNavLink renderIcon={Catalog} as={Link} to="catalog">
          Catalog
        </SideNavLink>
        <SideNavLink renderIcon={IntentRequestCreate} as={Link} to="create">
          Create
        </SideNavLink>
        <SideNavDivider />
        <SideNavLink renderIcon={Radar} as={Link} to="tech-radar">
          Tech Radar
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <Content style={{
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
    }}>
      {children}
    </Content>
  </>)} />
);
