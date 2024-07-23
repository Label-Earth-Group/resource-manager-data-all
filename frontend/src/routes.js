import { lazy, Suspense } from 'react';
import { AuthGuard, GuestGuard } from 'authentication';
import { ReAuthModal } from 'reauthentication';
import { EmptyLayout, DefaultLayout, LoadingScreen } from 'design';
import { ModuleNames, isModuleEnabled } from 'utils';
import { Navigate } from 'react-router';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Authentication pages
const Login = Loadable(lazy(() => import('./authentication/views/Login')));

// Error pages
const NotFound = Loadable(
  lazy(() => import('./modules/NotFound/views/NotFound'))
);

const OrganizationList = Loadable(
  lazy(() => import('./modules/Organizations/views/OrganizationList'))
);
const OrganizationView = Loadable(
  lazy(() => import('./modules/Organizations/views/OrganizationView'))
);
const OrganizationCreateForm = Loadable(
  lazy(() => import('./modules/Organizations/views/OrganizationCreateForm'))
);
const OrganizationEditForm = Loadable(
  lazy(() => import('./modules/Organizations/views/OrganizationEditForm'))
);
const EnvironmentCreateForm = Loadable(
  lazy(() => import('./modules/Environments/views/EnvironmentCreateForm'))
);
const EnvironmentEditForm = Loadable(
  lazy(() => import('./modules/Environments/views/EnvironmentEditForm'))
);
const EnvironmentView = Loadable(
  lazy(() => import('./modules/Environments/views/EnvironmentView'))
);
const EnvironmentList = Loadable(
  lazy(() => import('./modules/Environments/views/EnvironmentList'))
);
const Catalog = Loadable(lazy(() => import('./modules/Catalog/views/Catalog')));

const DatasetList = Loadable(
  lazy(() => import('./modules/Datasets/views/DatasetList'))
);
const DatasetView = Loadable(
  lazy(() => import('./modules/Datasets/views/DatasetView'))
);
const DatasetCreateForm = Loadable(
  lazy(() => import('./modules/Datasets/views/DatasetCreateForm'))
);
const DatasetImportForm = Loadable(
  lazy(() => import('./modules/Datasets/views/DatasetImportForm'))
);
const DatasetEditForm = Loadable(
  lazy(() => import('./modules/Datasets/views/DatasetEditForm'))
);
const TableView = Loadable(
  lazy(() => import('./modules/Tables/views/TableView'))
);
const TableEditForm = Loadable(
  lazy(() => import('./modules/Tables/views/TableEditForm'))
);

const FolderCreateForm = Loadable(
  lazy(() => import('./modules/Folders/views/FolderCreateForm'))
);
const FolderView = Loadable(
  lazy(() => import('./modules/Folders/views/FolderView'))
);
const FolderEditForm = Loadable(
  lazy(() => import('./modules/Folders/views/FolderEditForm'))
);

const NotebookList = Loadable(
  lazy(() => import('./modules/Notebooks/views/NotebookList'))
);
const NotebookView = Loadable(
  lazy(() => import('./modules/Notebooks/views/NotebookView'))
);
const NotebookCreateForm = Loadable(
  lazy(() => import('./modules/Notebooks/views/NotebookCreateForm'))
);

const MLStudioList = Loadable(
  lazy(() => import('./modules/MLStudio/views/MLStudioList'))
);
const MLStudioView = Loadable(
  lazy(() => import('./modules/MLStudio/views/MLStudioView'))
);
const MLStudioCreateForm = Loadable(
  lazy(() => import('./modules/MLStudio/views/MLStudioCreateForm'))
);

const DashboardList = Loadable(
  lazy(() => import('./modules/Dashboards/views/DashboardList'))
);
const DashboardImportForm = Loadable(
  lazy(() => import('./modules/Dashboards/views/DashboardImportForm'))
);
const DashboardEditForm = Loadable(
  lazy(() => import('./modules/Dashboards/views/DashboardEditForm'))
);
const DashboardView = Loadable(
  lazy(() => import('./modules/Dashboards/views/DashboardView'))
);
const DashboardSessionStarter = Loadable(
  lazy(() => import('./modules/Dashboards/views/DashboardSessionStarter'))
);

const PipelineList = Loadable(
  lazy(() => import('./modules/Pipelines/views/PipelineList'))
);
const PipelineView = Loadable(
  lazy(() => import('./modules/Pipelines/views/PipelineView'))
);
const PipelineCreateForm = Loadable(
  lazy(() => import('./modules/Pipelines/views/PipelineCreateForm'))
);
const PipelineEditForm = Loadable(
  lazy(() => import('./modules/Pipelines/views/PipelineEditForm'))
);

const ShareList = Loadable(
  lazy(() => import('./modules/Shares/views/ShareList'))
);
const ShareView = Loadable(
  lazy(() => import('./modules/Shares/views/ShareView'))
);

const WorksheetList = Loadable(
  lazy(() => import('./modules/Worksheets/views/WorksheetList'))
);
const WorksheetView = Loadable(
  lazy(() => import('./modules/Worksheets/views/WorksheetView'))
);
const WorksheetCreateForm = Loadable(
  lazy(() => import('./modules/Worksheets/views/WorksheetCreateForm'))
);

const GlossaryList = Loadable(
  lazy(() => import('./modules/Glossaries/views/GlossaryList'))
);
const GlossaryView = Loadable(
  lazy(() => import('./modules/Glossaries/views/GlossaryView'))
);
const GlossaryCreateForm = Loadable(
  lazy(() => import('./modules/Glossaries/views/GlossaryCreateForm'))
);

const AdministrationView = Loadable(
  lazy(() => import('./modules/Administration/views/AdministrationView'))
);

// EODAG routers
const StacSearch = Loadable(
  lazy(() => import('./modules/EODAG/views/StacSearch.tsx'))
);

const StacCollectionsBrowse = Loadable(
  lazy(() => import('./modules/EODAG/views/StacCollectionsBrowse'))
);
const StacCollectionContent = Loadable(
  lazy(() => import('./modules/EODAG/views/StacCollectionContent'))
);
const StacItemDetail = Loadable(
  lazy(() => import('./modules/EODAG/views/StacItemDetail'))
);

// remote sensing image search router
const SearchImage = Loadable(
  lazy(() => import('./modules/EODAG/views/SearchImage.tsx'))
);

// labeling or SAM routers
const SamView = Loadable(lazy(() => import('./modules/Sam/views/SamView')));
const LabelStudioView = Loadable(
  lazy(() => import('./modules/LabelStudio/views/LabelStudio.js'))
);

// PGSTAC routers
const PGStacCollectionsBrowse = Loadable(
  lazy(() => import('./modules/PGSTAC/views/PGStacCollectionsBrowse.js'))
);
const PGStacCollectionContent = Loadable(
  lazy(() => import('./modules/PGSTAC/views/PGStacCollectionContent.js'))
);
const PGStacItemDetail = Loadable(
  lazy(() => import('./modules/PGSTAC/views/PGStacItemDetail.js'))
);

const ImageAssetsView = Loadable(
  lazy(() => import('./modules/ImageData/views/ImageAssets'))
);

const ToolBoxView = Loadable(
  lazy(() => import('./modules/GeoToolBox/views/leafmap.js'))
);

const GeoJournalView = Loadable(
  lazy(() => import('./modules/GeoJournal/views/RepoExplorer.js'))
);

const AutoSolverView = Loadable(
  lazy(() => import('./modules/AutoSolver/views/AutoSolver.js'))
);

const routes = [
  {
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      }
    ]
  },
  {
    path: 'console',
    element: (
      <AuthGuard>
        <DefaultLayout />
        {(process.env.REACT_APP_COGNITO_USER_POOL_ID ||
          process.env.REACT_APP_CUSTOM_AUTH) && <ReAuthModal />}
      </AuthGuard>
    ),
    children: [
      {
        children: [
          {
            path: 'eodag',
            element: <StacCollectionsBrowse />
          },
          {
            path: 'eodag/search',
            element: <StacSearch />
          },
          {
            path: 'eodag/collections',
            element: <Navigate to="/console/eodag" />
          },
          {
            path: 'eodag/collections/:collectionID',
            element: <StacCollectionContent />
          },
          {
            path: 'eodag/collections/:collectionID/items/:itemID',
            element: <StacItemDetail />
          }
        ]
      },
      {
        children: [
          {
            path: 'repository',
            element: <PGStacCollectionsBrowse />
          },
          {
            path: 'repository/collections',
            element: <Navigate to="/console/repository" />
          },
          {
            path: 'repository/collections/:collectionID',
            element: <PGStacCollectionContent />
          },
          {
            path: 'repository/collections/:collectionID/items/:itemID',
            element: <PGStacItemDetail />
          },
          {
            path: 'repository/assets',
            element: <ImageAssetsView />
          }
        ]
      },
      {
        children: [
          {
            path: 'sam',
            element: <SamView />
          }
        ]
      },
      {
        children: [
          {
            path: 'labelling',
            element: <LabelStudioView />
          }
        ]
      },
      {
        children: [
          {
            path: 'geotoolbox',
            element: <ToolBoxView />
          }
        ]
      },
      {
        children: [
          {
            path: 'geojournal/repos/:owner/:repo/*',
            element: <GeoJournalView />
          }
        ]
      },
      {
        children: [
          {
            path: 'autosolver',
            element: <AutoSolverView />
          }
        ]
      },
      {
        children: [
          {
            path: 'organizations',
            element: <OrganizationList />
          },
          {
            path: 'organizations/:uri',
            element: <OrganizationView />
          },
          {
            path: 'organizations/:uri/edit',
            element: <OrganizationEditForm />
          },
          {
            path: 'organizations/new',
            element: <OrganizationCreateForm />
          },
          {
            path: 'organizations/:uri/link',
            element: <EnvironmentCreateForm />
          }
        ]
      },
      {
        children: [
          {
            path: 'environments',
            element: <EnvironmentList />
          },
          {
            path: 'environments/:uri',
            element: <EnvironmentView />
          },
          {
            path: 'environments/:uri/edit',
            element: <EnvironmentEditForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.CATALOG) && {
        path: 'catalog',
        element: <Catalog />
      },
      isModuleEnabled(ModuleNames.DATASETS) && {
        children: [
          {
            path: 'datasets',
            element: <DatasetList />
          },
          {
            path: 'datasets/:uri',
            element: <DatasetView />
          },
          {
            path: 'datasets/new',
            element: <DatasetCreateForm />
          },
          {
            path: 'datasets/import',
            element: <DatasetImportForm />
          },
          {
            path: 'datasets/:uri/edit',
            element: <DatasetEditForm />
          },
          {
            path: 'datasets/:uri/edit',
            element: <DatasetEditForm />
          },
          {
            path: 'datasets/table/:uri',
            element: <TableView />
          },
          {
            path: 'datasets/table/:uri/edit',
            element: <TableEditForm />
          },
          {
            path: 'datasets/:uri/newfolder',
            element: <FolderCreateForm />
          },
          {
            path: 'datasets/folder/:uri',
            element: <FolderView />
          },
          {
            path: 'datasets/folder/:uri/edit',
            element: <FolderEditForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.MLSTUDIO) && {
        children: [
          {
            path: 'mlstudio',
            element: <MLStudioList />
          },
          {
            path: 'mlstudio/:uri',
            element: <MLStudioView />
          },
          {
            path: 'mlstudio/new',
            element: <MLStudioCreateForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.NOTEBOOKS) && {
        children: [
          {
            path: 'notebooks',
            element: <NotebookList />
          },
          {
            path: 'notebooks/:uri',
            element: <NotebookView />
          },
          {
            path: 'notebooks/new',
            element: <NotebookCreateForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.DASHBOARDS) && {
        children: [
          {
            path: 'dashboards',
            element: <DashboardList />
          },
          {
            path: 'dashboards/:uri',
            element: <DashboardView />
          },
          {
            path: 'dashboards/session',
            element: <DashboardSessionStarter />
          },
          {
            path: 'dashboards/import',
            element: <DashboardImportForm />
          },
          {
            path: 'dashboards/:uri/edit',
            element: <DashboardEditForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.DATAPIPELINES) && {
        children: [
          {
            path: 'pipelines',
            element: <PipelineList />
          },
          {
            path: 'pipelines/:uri',
            element: <PipelineView />
          },
          {
            path: 'pipelines/new',
            element: <PipelineCreateForm />
          },
          {
            path: 'pipelines/:uri/edit',
            element: <PipelineEditForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.SHARES) && {
        children: [
          {
            path: 'shares',
            element: <ShareList />
          },
          {
            path: 'shares/:uri',
            element: <ShareView />
          }
        ]
      },
      isModuleEnabled(ModuleNames.WORKSHEETS) && {
        children: [
          {
            path: 'worksheets',
            element: <WorksheetList />
          },
          {
            path: 'worksheets/:uri',
            element: <WorksheetView />
          },
          {
            path: 'worksheets/new',
            element: <WorksheetCreateForm />
          }
        ]
      },
      isModuleEnabled(ModuleNames.GLOSSARIES) && {
        children: [
          {
            path: 'glossaries',
            element: <GlossaryList />
          },
          {
            path: 'glossaries/:uri',
            element: <GlossaryView />
          },
          {
            path: 'glossaries/new',
            element: <GlossaryCreateForm />
          }
        ]
      },
      {
        children: [
          {
            path: 'administration',
            element: <AdministrationView />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: (
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <></>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: 'search',
    element: (
      <AuthGuard>
        <EmptyLayout />
        {(process.env.REACT_APP_COGNITO_USER_POOL_ID ||
          process.env.REACT_APP_CUSTOM_AUTH) && <ReAuthModal />}
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <SearchImage />
      }
    ]
  }
];

export default routes;
