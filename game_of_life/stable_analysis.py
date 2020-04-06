import numpy as np
import scipy.linalg
import matplotlib.pyplot as plt
from matplotlib import cm
from random import randint
import scipy.optimize as optimize
from mpl_toolkits.mplot3d import Axes3D
from sklearn.metrics import mean_squared_error, r2_score


class StablePlot:
    """
    Find the best curse regarding the the given function
    """

    fig_index = 1
    funcs = []

    def __init__(self,
                 data_path: str):
        self.p_values = []
        self.pop_sizes = []
        self.data = []
        with open(data_path, "r") as data_file:
            index = 0
            for line in data_file.readlines():
                if index == 0:
                    self.pop_sizes = [int(i.replace("population size = ", "")) for i in line.split(",")[1:-1]]
                    index += 1
                    continue
                items = line.split(",")[:-1]
                self.p_values.append(int(items[0]))
                self.data.append([int(i) for i in items[1:]])
                index += 1

    def fit_points(self):
        """
        find the best fitting
        :return: the params and save a file
        """
        x = []
        y = []
        z = []
        for p_index, p_value in enumerate(self.p_values):
            for pop_index, pop_size in enumerate(self.pop_sizes):
                x.append(p_value)
                y.append(pop_size)
                z.append(self.data[p_index][pop_index])
        data = np.c_[x, y, z]
        mn = np.min(data, axis=0)
        mx = np.max(data, axis=0)
        X, Y = np.meshgrid(np.linspace(mn[0], mx[0], 100), np.linspace(mn[1], mx[1], 100))
        XX = X.flatten()
        YY = Y.flatten()

        # best-fit linear plane
        A = np.c_[data[:, 0], data[:, 1], np.ones(data.shape[0])]
        C, _, _, _ = scipy.linalg.lstsq(A, data[:, 2])  # coefficients

        # evaluate it on grid
        Z = np.dot(np.c_[XX, YY, np.ones(XX.shape)], C).reshape(X.shape)

        XX = np.asarray(x)
        YY = np.asarray(y)
        z_pred = np.dot(np.c_[XX, YY, np.ones(XX.shape)], C).reshape(XX.shape)
        print("Params: {}".format(C))
        print("R^2 = {}".format(r2_score(np.asarray(z), z_pred)))

        StablePlot.funcs.append([C[0], C[1], C[2]])

        fig = plt.figure()
        ax = fig.gca(projection='3d')
        surf = ax.plot_surface(X, Y, Z, rstride=1, cstride=1, alpha=0.6, linewidth=0, antialiased=False, cmap=cm.coolwarm)
        ax.scatter(data[:, 0], data[:, 1], data[:, 2], c='black', s=5, alpha=0.5)
        plt.xlabel("P values")
        plt.ylabel("Population Size")
        ax.set_zlabel("Average Generation To Converge")
        ax.axis('equal')
        ax.axis('tight')
        # Add a color bar which maps values to colors.
        fig.colorbar(surf, shrink=0.5, aspect=5)
        # plt.show()
        plt.savefig("fig_{}.png".format(StablePlot.fig_index))
        StablePlot.fig_index += 1

    def calc_deltas_in_layers(self):
        deltas = []
        layers = []
        for i in range(StablePlot.fig_index - 1):
            layer_k = []
            for p_index, p_value in enumerate(self.p_values):
                for pop_index, pop_size in enumerate(self.pop_sizes):
                    layer_k.append(f(p_value, pop_size, StablePlot.funcs[i][0], StablePlot.funcs[i][1], StablePlot.funcs[i][2]))
            layers.append(layer_k)
        for i in range(StablePlot.fig_index - 2):
            deltas.append(sum(list_delta(layers[i + 1], layers[i])) / len(layers[i]))

        fig = plt.figure()
        plt.plot([i for i in range(len(deltas))], deltas, linestyle='--', marker='o', color='r')
        plt.ylabel("Delta In Data Points (numerical integral)")
        plt.xlabel("K value")
        plt.savefig("summery.png")


def f(x, y, a, b, c):
    return a + b * x + c * y


def list_delta(arr1: list, arr2: list):
    return [arr1[i] - arr2[i] for i in range(len(arr1))]


if __name__ == '__main__':
    model = None
    for i in range(1, 9):
        model = StablePlot(r"C:\Users\user\Desktop\game_of_life_corona_k_eq_{}.txt".format(i))
        model.fit_points()
    model.calc_deltas_in_layers()
